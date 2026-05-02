% torsion_spring_search_rect.m
% Unified design-space search for helical torsion springs with rectangular wire.
% Author: (You can put your name)
% Date: 30 Nov 2025
clear; close all; clc;

% -----------------------------
% Material / general settings
% -----------------------------
G = 79e9;                 % Shear modulus for common spring steel [Pa]
sigma_allow = 400e6;      % Allowable bending stress [Pa] (example, change per steel)
deg2rad = pi/180;

% -----------------------------
% Problem / target inputs (sample)
% -----------------------------
% Targets given in Nm per degree (user-specified)
targets_deg = [5, 10, 15];                % [Nm/deg] target stiffnesses
% Angular deflection limits for each target (degrees, +/-)
angle_limits = [15, 10, 5];               % [+/- degrees] corresponding to 5,10,15 Nm/deg springs
outer_dia_max = 100e-3;                   % maximum outer diameter [m]

% Convert target stiffness from Nm/deg to Nm/rad:
targets_rad = targets_deg * (180/pi);     % K [Nm/rad] = K[Nm/deg] * (180/pi)

% -----------------------------
% Geometry search ranges (tweakable)
% -----------------------------
Dm_list = (50e-3 : 5e-3 : 90e-3);         % mean diameter candidates [m]
w_list  = (5e-3 : 1e-3 : 20e-3);          % rectangular wire width [m] (b - larger side)
h_list  = (2e-3 : 1e-3 : 6e-3);           % rectangular wire height [m] (a - smaller side)
N_list  = 4:1:30;                         % number of active coils (integer)
tol_pct = 0.06;                           % allowed ±6% tolerance on stiffness match

% A small helper: torsion constant J for rectangle
% Using approximate formula: J = a*b^3*(1/3 - 0.21*(a/b)*(1 - a^4/(12*b^4)))
rectJ = @(a,b) ( ...
    (min(a,b)) .* (max(a,b)).^3 .* (1/3 - 0.21*(min(a,b)./max(a,b)).*(1 - (min(a,b).^4)./(12*max(a,b).^4))) ...
    );

% Storage
solutions = [];

% -----------------------------
% Loop: search design space
% -----------------------------
for Dm = Dm_list
    for b = w_list       % b = larger side (width)
        for a = h_list   % a = smaller side (height)
            J = rectJ(a,b);            % torsion constant [m^4]
            if J <= 0
                continue
            end
            for N = N_list
                outer_dia = Dm + max(a,b);  % crude outer diameter estimate
                if outer_dia > outer_dia_max
                    continue
                end
                K_rad = (G * J) / (Dm * N);      % stiffness [Nm/rad]
                K_deg = K_rad / (180/pi);        % convert to Nm/deg (for comparison)
                % For each target check feasibility
                for t = 1:numel(targets_deg)
                    K_target_deg = targets_deg(t);
                    K_target_rad = targets_rad(t);
                    % check stiffness within tolerance
                    if abs((K_deg - K_target_deg)/K_target_deg) <= tol_pct
                        % Now check stress under the required maximum applied torque
                        % Applied torque magnitude based on target stiffness and required deflection:
                        theta = angle_limits(t);                 % degrees (positive)
                        T_applied = K_target_deg * theta;        % Nm (since K in Nm/deg)
                        % Conservative bending estimate:
                        % Equivalent bending moment at wire section (heuristic):
                        M_eq = (T_applied * (Dm/2)) / N;         % [N*m]
                        % Bending section modulus: sigma = M*c / I
                        % Use bending about the small side: I = b*a^3/12  (b: width, a: height)
                        I = b * a^3 / 12;
                        c = a/2;  % distance to extreme fiber
                        sigma_bend = abs(M_eq * c / I);         % [Pa]
                        if sigma_bend <= sigma_allow
                            % Save a solution record
                            rec.Dm = Dm;
                            rec.outer_dia = outer_dia;
                            rec.b = b; rec.a = a;
                            rec.N = N;
                            rec.K_deg = K_deg;
                            rec.K_rad = K_rad;
                            rec.T_applied = T_applied;
                            rec.sigma_bend = sigma_bend;
                            rec.target_index = t;
                            solutions = [solutions; rec]; %#ok<AGROW>
                        end
                    end
                end
            end
        end
    end
end

% -----------------------------
% Summarize & filter solutions
% -----------------------------
fprintf('Total feasible candidate configurations found: %d\n', numel(solutions));

% Convert struct array to table for easy viewing
if isempty(solutions)
    disp('No feasible solutions found with these search ranges and limits.');
    return;
end

S = struct2table(solutions);
% Round display numbers
S.Dm_mm = round(S.Dm*1e3,1);
S.outer_mm = round(S.outer_dia*1e3,1);
S.b_mm = round(S.b*1e3,2);
S.a_mm = round(S.a*1e3,2);
S.K_deg_round = round(S.K_deg,3);
S.sigma_MPa = round(S.sigma_bend/1e6,3);
S.T_Nm = round(S.T_applied,3);

% keep relevant columns and sort by target then N
T = S(:, {'target_index','Dm_mm','outer_mm','b_mm','a_mm','N','K_deg_round','T_Nm','sigma_MPa'});
T = sortrows(T, {'target_index','N'});

% show top few
disp('Top feasible candidates (first 30 rows):');
disp(T(1:min(30,height(T)),:));

% Save to CSV for inclusion in portfolio
writetable(T, 'torsion_candidates_table.csv');
fprintf('Saved candidate table to torsion_candidates_table.csv\n');

% -----------------------------
% Example: choose an artistic triple with identical cross-section
% (Find same b,a,Dm which have solutions for target_index 1,2,3)
% -----------------------------
unique_keys = unique(strcat(string(S.b), '_', string(S.a), '_', string(S.Dm)));
chosen_triples = [];
for i = 1:numel(unique_keys)
    parts = split(unique_keys(i), '_');
    bkey = str2double(parts{1}); akey = str2double(parts{2}); Dmkey = str2double(parts{3});
    idx1 = find(S.b==bkey & S.a==akey & abs(S.Dm - Dmkey)<1e-12 & S.target_index==1);
    idx2 = find(S.b==bkey & S.a==akey & abs(S.Dm - Dmkey)<1e-12 & S.target_index==2);
    idx3 = find(S.b==bkey & S.a==akey & abs(S.Dm - Dmkey)<1e-12 & S.target_index==3);
    if ~isempty(idx1) && ~isempty(idx2) && ~isempty(idx3)
        chosen_triples = [chosen_triples; bkey akey Dmkey];
    end
end

if ~isempty(chosen_triples)
    % pick the first triple for the portfolio example
    bsel = chosen_triples(1,1); asel = chosen_triples(1,2); Dmsel = chosen_triples(1,3);
    fprintf('Found at least one consistent cross-section (b=%g m, a=%g m, Dm=%g m) usable for all targets.\n', bsel, asel, Dmsel);
    % show the matching rows
    rows = S(S.b==bsel & S.a==asel & abs(S.Dm - Dmsel)<1e-12, :);
    disp(rows);
else
    disp('No identical cross-section found that satisfied all three target criteria in this search run.');
end
