/* =========================================================
   CONFIGURATION
   ========================================================= */

const API_URL =
    'https://script.google.com/macros/s/AKfycbw6XYWwBerNfC0JmssqR1fGffy7PfGdd7i6EsCNtILK59n4JfZvdctRJi3apdPAeDciOA/exec';


/* =========================================================
   DATA
   ========================================================= */

let headers = [];

let rows = [];

let columnMap = {};


/* =========================================================
   COLUMN DEFINITIONS
   ========================================================= */

const COLUMN_DEFINITIONS = {

    number: {
        label: '#'
    },

      level: {
        label: 'level'
    },

    type: {
        label: 'type'
    },

    chapter: {
        label: 'Kapitel'
    },

    importance: {
        label: 'importance'
    },

    demands: {
        label: 'demands'
    },

    trennbar: {
        label: 'trennbar'
    },

    auxiliary: {
        label: 'Hilfsverb'
    },

    english: {
        label: 'infinitive'
    },

    partizip: {
        label: 'Partizip II'
    }

};


/* =========================================================
   FILTER VALUES
   ========================================================= */

const FILTER_VALUES = {

    type: [
        'regular',
        'irregular'
    ],

    trennbar: [
        'separable',
        'non-separable'
    ],

    importance: [
        'must know',
        'good to know',
        'ignore'
    ],

    demands: [
        'Akk. Objekt',
        'Dat. Objekt',
        'both Akk. and Dat. Objekt',
        'none'
    ],

    auxiliary: [
        'haben',
        'sein',
        'haben / sein'
    ]

};


/* =========================================================
   LUCKY MODE
   ========================================================= */

let luckyMode =
    false;

let luckyRows =
    [];

/* =========================================================
   DEFAULT COLUMN STATE
   ========================================================= */

const DEFAULT_COLUMNS =
    new Set([
        'english',
        'partizip'
    ]);


let selectedColumns =
    new Set(
        DEFAULT_COLUMNS
    );


/* =========================================================
   FILTER STATE
   ========================================================= */

let selectedTypes =
    new Set([
        'regular',
        'irregular'
    ]);


let selectedTrennbar =
    new Set([
        'non-separable'
    ]);


let selectedImportance =
    new Set([
        'must know'
    ]);


let selectedDemands =
    null;


let selectedAuxiliaries =
    new Set([
        'haben',
        'sein',
        'haben / sein'
    ]);


/* =========================================================
   LEVEL / KAPITEL
   ========================================================= */

let selectedLevels =
    new Set([
        'A1'
    ]);


let selectedChapters =
    new Set();


/* =========================================================
   TENSE MODES
   ========================================================= */

let presentMode =
    'basic';


let pastMode =
    'none';


/* =========================================================
   BASIC HELPERS
   ========================================================= */

function normalise(value) {

    return String(
        value ?? ''
    )
        .trim()
        .toLowerCase()
        .replace(
            /\s+/g,
            ' '
        );

}


function validIndex(value) {

    return (
        Number.isInteger(value) &&
        value >= 0
    );

}


function unique(values) {

    return [
        ...new Set(values)
    ];

}


/* =========================================================
   LOAD DATA
   ========================================================= */

async function loadData() {

    const loading =
        document.getElementById(
            'loading'
        );


    const tableContainer =
        document.getElementById(
            'tableContainer'
        );


    const docsNode =
        String(
            localStorage.getItem(
                'DOCSnode'
            ) || ''
        ).trim();


    if (!docsNode) {

        showError(
            'This browser has no DOCSlicense.'
        );

        return;

    }


    try {

        const url =
            API_URL +
            '?node=' +
            encodeURIComponent(
                docsNode
            );


        const response =
            await fetch(
                url,
                {
                    method:
                        'GET',

                    cache:
                        'no-store'
                }
            );


        if (!response.ok) {

            throw new Error(
                'HTTP ' +
                response.status
            );

        }


        const data =
            await response.json();


        if (
            !data ||
            !Array.isArray(
                data.headers
            ) ||
            !Array.isArray(
                data.data
            )
        ) {

            showError(
                'Access denied or invalid data received.'
            );

            return;

        }


        /*
         * The response is valid.
         * Hide loading NOW.
         */

        if (loading) {

            loading.classList.add(
                'hidden'
            );

        }


        /*
         * Store data.
         */

        headers =
            data.headers;

        rows =
            data.data;


        /*
         * Map database columns.
         */

        detectColumnMap();


        if (
            !validIndex(
                columnMap.infinitive
            )
        ) {

            throw new Error(
                'Infinitiv column not found.'
            );

        }


        /*
         * Show table.
         */

        if (tableContainer) {

            tableContainer.classList.remove(
                'hidden'
            );

        }


        /*
         * Build UI.
         */

        buildColumnDropdown();

        buildChapterGrid();

        setupControls();

        syncUI();

        renderTable();


        updateTableContainerWidth();

    }

    catch (error) {

        console.error(
            'Verb database loading failed:',
            error
        );


        if (tableContainer) {

            tableContainer.classList.add(
                'hidden'
            );

        }


        showError(
            'Could not load the verb data.'
        );

    }

}


/* =========================================================
   DETECT DATABASE COLUMNS
   ========================================================= */

function detectColumnMap() {

    columnMap = {};


    const groupRow =
        headers[0] || [];


    const nameRow =
        headers[1] || [];


    nameRow.forEach(
        (
            rawName,
            index
        ) => {

            const name =
                normalise(
                    rawName
                );


            const group =
                normalise(
                    groupRow[index]
                );


            if (
                name === '#'
            ) {

                columnMap.number =
                    index;

                return;

            }


            if (
                name === 'level'
            ) {

                columnMap.level =
                    index;

                return;

            }


            if (
                name === 'kapitel'
            ) {

                columnMap.chapter =
                    index;

                return;

            }


            if (
                name === 'importance'
            ) {

                columnMap.importance =
                    index;

                return;

            }


            if (
                name === 'type'
            ) {

                columnMap.type =
                    index;

                return;

            }


            if (
                name === 'hilfsverb'
            ) {

                columnMap.auxiliary =
                    index;

                return;

            }


            if (
                name === 'demands'
            ) {

                columnMap.demands =
                    index;

                return;

            }


            if (
                name === 'trennbar'
            ) {

                columnMap.trennbar =
                    index;

                return;

            }


            if (
                name === 'infinitive'
            ) {

                columnMap.english =
                    index;

                return;

            }


            if (
                name === 'infinitiv'
            ) {

                columnMap.infinitive =
                    index;

                return;

            }


            if (
                name === 'partizip ii'
            ) {

                columnMap.partizip =
                    index;

                return;

            }


            if (
                group === 'präsens'
            ) {

                if (
                    name === 'ich' &&
                    columnMap.presentIch === undefined
                ) {

                    columnMap.presentIch =
                        index;

                    return;

                }


                if (
                    name === 'du' &&
                    columnMap.presentDu === undefined
                ) {

                    columnMap.presentDu =
                        index;

                    return;

                }


                if (
                    name === 'er' &&
                    columnMap.presentEr === undefined
                ) {

                    columnMap.presentEr =
                        index;

                    return;

                }


                if (
                    name === 'ihr' &&
                    columnMap.presentIhr === undefined
                ) {

                    columnMap.presentIhr =
                        index;

                    return;

                }

            }


            if (
                group === 'präteritum'
            ) {

                if (
                    name === 'ich' &&
                    columnMap.pastIch === undefined
                ) {

                    columnMap.pastIch =
                        index;

                    return;

                }


                if (
                    name === 'du' &&
                    columnMap.pastDu === undefined
                ) {

                    columnMap.pastDu =
                        index;

                    return;

                }


                if (
                    name === 'er' &&
                    columnMap.pastEr === undefined
                ) {

                    columnMap.pastEr =
                        index;

                    return;

                }


                if (
                    name === 'wir' &&
                    columnMap.pastWir === undefined
                ) {

                    columnMap.pastWir =
                        index;

                    return;

                }


                if (
                    name === 'ihr' &&
                    columnMap.pastIhr === undefined
                ) {

                    columnMap.pastIhr =
                        index;

                    return;

                }

            }

        }
    );

}


/* =========================================================
   COLUMN DROPDOWN
   ========================================================= */

function buildColumnDropdown() {

    const main =
        document.getElementById(
            'mainColumnOptions'
        );


    const more =
        document.getElementById(
            'moreColumnOptions'
        );


    if (
        !main ||
        !more
    ) {

        return;

    }


    main.innerHTML =
        '';


    more.innerHTML = `
        <div class="dropdown-section">
            more
        </div>
    `;


    createColumnCheckbox(
        main,
        'english'
    );


    main.appendChild(
        createModeControl(
            'present',
            'Präsens'
        )
    );


    createColumnCheckbox(
        main,
        'partizip'
    );


    main.appendChild(
        createModeControl(
            'past',
            'Präteritum'
        )
    );


   [
    'number',
    'level',
    'type',
    'chapter',
    'importance',
    'demands',
    'trennbar',
    'auxiliary'
].forEach(
        id => {

            createColumnCheckbox(
                more,
                id
            );

        }
    );

}


/* =========================================================
   COLUMN CHECKBOX
   ========================================================= */

function createColumnCheckbox(
    container,
    id
) {

    const definition =
        COLUMN_DEFINITIONS[id];


    const label =
        document.createElement(
            'label'
        );


    label.className =
        'dropdown-option';


    const checkbox =
        document.createElement(
            'input'
        );


    checkbox.type =
        'checkbox';


    checkbox.dataset.columnGroup =
        id;


    checkbox.checked =
        selectedColumns.has(
            id
        );


    checkbox.addEventListener(
        'change',
        () => {

            if (
                checkbox.checked
            ) {

                selectedColumns.add(
                    id
                );

            } else {

                selectedColumns.delete(
                    id
                );

            }


            syncColumnUI();

            renderTable();

        }
    );


    const text =
        document.createElement(
            'span'
        );


    text.textContent =
        definition.label;


    label.appendChild(
        checkbox
    );


    label.appendChild(
        text
    );


    container.appendChild(
        label
    );

}


/* =========================================================
   MODE CONTROL
   ========================================================= */


   function createModeControl(
    type,
    label
) {

    const wrapper =
        document.createElement(
            'div'
        );


    wrapper.className =
        'mode-option';


    wrapper.dataset.modeType =
        type;


    const button =
        document.createElement(
            'button'
        );


    button.type =
        'button';


    button.className =
        'mode-button';


    const title =
        document.createElement(
            'span'
        );


    title.textContent =
        label;


    const value =
        document.createElement(
            'span'
        );


    value.className =
        'mode-value';


    const arrow =
        document.createElement(
            'span'
        );


    arrow.className =
        'mode-arrow';


    arrow.textContent =
        '›';


    button.append(
        title,
        value,
        arrow
    );


    const submenu =
        document.createElement(
            'div'
        );


    submenu.className =
        'mode-submenu';


    [
        ['basic', 'ich, du'],
        ['all', 'all'],
        ['none', 'none']
    ].forEach(
        (
            [mode, text]
        ) => {

            const choice =
                document.createElement(
                    'button'
                );


            choice.type =
                'button';


            choice.className =
                'mode-choice';


            choice.dataset.mode =
                mode;


            choice.textContent =
                text;


            choice.addEventListener(
                'click',
                event => {

                    event.stopPropagation();


                    if (
                        type ===
                        'present'
                    ) {

                        presentMode =
                            mode;

                    } else {

                        pastMode =
                            mode;

                    }


                    /*
                     * Close every nested submenu.
                     */

                    closeAllSubmenus();


                    syncModeUI();

                    renderTable();

                }
            );


            submenu.appendChild(
                choice
            );

        }
    );


    wrapper.append(
        button,
        submenu
    );


    button.addEventListener(
        'click',
        event => {

            event.stopPropagation();


            /*
             * Remember whether this particular
             * submenu is currently open.
             */

            const wasOpen =
                wrapper.classList.contains(
                    'open'
                );


            /*
             * Close EVERYTHING first.
             *
             * This closes:
             * - More
             * - another tense submenu
             * - another nested menu
             * - stale submenu states
             */

            closeAllSubmenus();


            /*
             * If it was closed before the click,
             * open it now.
             *
             * If it was already open, leave it closed.
             */

            if (
                !wasOpen
            ) {

                wrapper.classList.add(
                    'open'
                );

            }

        }
    );


    return wrapper;

}


/* =========================================================
   MODE UI
   ========================================================= */

function syncModeUI() {

    document
        .querySelectorAll(
            '.mode-option'
        )
        .forEach(
            wrapper => {

                const type =
                    wrapper.dataset.modeType;


                const mode =
                    type === 'present'
                        ? presentMode
                        : pastMode;


                const value =
                    wrapper.querySelector(
                        '.mode-value'
                    );


                value.textContent =
                    mode === 'basic'
                        ? 'ich, du'
                        : mode === 'all'
                            ? 'all'
                            : 'none';


                wrapper
                    .querySelectorAll(
                        '.mode-choice'
                    )
                    .forEach(
                        choice => {

                            choice.classList.toggle(
                                'selected',
                                choice.dataset.mode ===
                                    mode
                            );

                        }
                    );

            }
        );

}


/* =========================================================
   CHAPTER GRID
   ========================================================= */

function buildChapterGrid() {

    const grid =
        document.getElementById(
            'chapterGrid'
        );


    if (!grid) {

        return;

    }


    grid.innerHTML =
        '';


    const corner =
        document.createElement(
            'div'
        );


    corner.className =
        'chapter-grid-cell';


    grid.appendChild(
        corner
    );


    for (
        let chapter = 1;
        chapter <= 12;
        chapter++
    ) {

        const header =
            document.createElement(
                'div'
            );


        header.className =
            'chapter-grid-cell chapter-grid-header';


        header.textContent =
            chapter;


        grid.appendChild(
            header
        );

    }


    [
        'A1',
        'A2',
        'B1'
    ].forEach(
        level => {

            const levelLabel =
                document.createElement(
                    'div'
                );


            levelLabel.className =
                'chapter-grid-cell chapter-level';


            levelLabel.textContent =
                level;


            grid.appendChild(
                levelLabel
            );


            for (
                let chapter = 1;
                chapter <= 12;
                chapter++
            ) {

                const button =
                    document.createElement(
                        'button'
                    );


                button.type =
                    'button';


                button.className =
                    'chapter-grid-cell chapter-button';


                button.dataset.level =
                    level;


                button.dataset.chapter =
                    String(
                        chapter
                    );


                const exists =
                    rows.some(
                        row => {

                            const levelValue =
                                String(
                                    row[
                                        columnMap.level
                                    ] ?? ''
                                )
                                    .trim()
                                    .toUpperCase();


                            const chapterValue =
                                String(
                                    row[
                                        columnMap.chapter
                                    ] ?? ''
                                )
                                    .trim();


                            return (
                                levelValue ===
                                    level &&
                                chapterValue ===
                                    String(
                                        chapter
                                    )
                            );

                        }
                    );


                if (
                    !exists
                ) {

                    button.disabled =
                        true;

                }


                button.addEventListener(
                    'click',
                    event => {

                        event.stopPropagation();


                        toggleChapter(
                            level,
                            chapter
                        );

                    }
                );


                grid.appendChild(
                    button
                );

            }

        }
    );


    syncChapterGrid();

}


/* =========================================================
   CHAPTER ACTIONS
   ========================================================= */

   function toggleChapter(
    level,
    chapter
) {

    exitLuckyMode();


    const key =
        level +
        ':' +
        chapter;


    if (
        selectedChapters.has(
            key
        )
    ) {

        selectedChapters.delete(
            key
        );

    } else {

        selectedChapters.add(
            key
        );

    }


    syncChapterGrid();

    renderTable();

}


function setAllChapters() {

    exitLuckyMode();


    selectedChapters.clear();


    selectedLevels =
        new Set([
            'A1',
            'A2',
            'B1'
        ]);


    syncChapterGrid();

    renderTable();

}


function setDefaultChapters() {

    exitLuckyMode();


    selectedChapters.clear();


    selectedLevels =
        new Set([
            'A1'
        ]);


    syncChapterGrid();

    renderTable();

}


function syncChapterGrid() {

    document
        .querySelectorAll(
            '.chapter-button'
        )
        .forEach(
            button => {

                const key =
                    button.dataset.level +
                    ':' +
                    button.dataset.chapter;


                button.classList.toggle(
                    'selected',
                    selectedChapters.has(
                        key
                    )
                );

            }
        );

}


/* =========================================================
   FILTER ACTIONS
   ========================================================= */
function toggleFilter(
    filter,
    value
) {

    exitLuckyMode();


    if (
        filter ===
        'demands'
    ) {

        if (
            selectedDemands ===
            null
        ) {

            selectedDemands =
                new Set(
                    FILTER_VALUES.demands
                );

        }


        if (
            selectedDemands.has(
                value
            )
        ) {

            selectedDemands.delete(
                value
            );

        } else {

            selectedDemands.add(
                value
            );

        }


        if (
            selectedDemands.size ===
            FILTER_VALUES.demands.length
        ) {

            selectedDemands =
                null;

        }

    } else {

        let set =
            null;


        if (
            filter ===
            'type'
        ) {

            set =
                selectedTypes;

        }


        if (
            filter ===
            'trennbar'
        ) {

            set =
                selectedTrennbar;

        }


        if (
            filter ===
            'importance'
        ) {

            set =
                selectedImportance;

        }


        if (
            filter ===
            'auxiliary'
        ) {

            set =
                selectedAuxiliaries;

        }


        if (!set) {

            return;

        }


        const normalised =
            normalise(
                value
            );


        if (
            set.has(
                normalised
            )
        ) {

            set.delete(
                normalised
            );

        } else {

            set.add(
                normalised
            );

        }

    }


    syncFilterUI();

    renderTable();

}

/* =========================================================
   ALL FILTER
   ========================================================= */

   function setAllFilter(
    filter
) {

    exitLuckyMode();


    if (
        filter ===
        'type'
    ) {

        selectedTypes =
            new Set(
                FILTER_VALUES.type
            );

    }


    if (
        filter ===
        'trennbar'
    ) {

        selectedTrennbar =
            new Set(
                FILTER_VALUES.trennbar
            );

    }


    if (
        filter ===
        'importance'
    ) {

        selectedImportance =
            new Set(
                FILTER_VALUES.importance
            );

    }


    if (
        filter ===
        'demands'
    ) {

        selectedDemands =
            null;

    }


    if (
        filter ===
        'auxiliary'
    ) {

        selectedAuxiliaries =
            new Set(
                FILTER_VALUES.auxiliary
            );

    }


    syncFilterUI();

    renderTable();

}


/* =========================================================
   DEFAULT FILTER
   ========================================================= */

   function setDefaultFilter(
    filter
) {

    exitLuckyMode();


    if (
        filter ===
        'type'
    ) {

        selectedTypes =
            new Set([
                'regular',
                'irregular'
            ]);

    }


    if (
        filter ===
        'trennbar'
    ) {

        selectedTrennbar =
            new Set([
                'non-separable'
            ]);

    }


    if (
        filter ===
        'importance'
    ) {

        selectedImportance =
            new Set([
                'must know'
            ]);

    }


    if (
        filter ===
        'demands'
    ) {

        selectedDemands =
            null;

    }


    if (
        filter ===
        'auxiliary'
    ) {

        selectedAuxiliaries =
            new Set(
                FILTER_VALUES.auxiliary
            );

    }


    syncFilterUI();

    renderTable();

}


/* =========================================================
   FILTER UI
   ========================================================= */

function syncFilterUI() {

    syncCheckboxGroup(
        'type',
        selectedTypes
    );


    syncCheckboxGroup(
        'trennbar',
        selectedTrennbar
    );


    syncCheckboxGroup(
        'importance',
        selectedImportance
    );


    syncCheckboxGroup(
        'auxiliary',
        selectedAuxiliaries
    );


    document
        .querySelectorAll(
            '[data-filter="demands"]'
        )
        .forEach(
            checkbox => {

                checkbox.checked =
                    selectedDemands === null ||
                    selectedDemands.has(
                        checkbox.value
                    );

            }
        );


    updateAllButtons();

}


function syncCheckboxGroup(
    filter,
    set
) {

    document
        .querySelectorAll(
            `[data-filter="${filter}"]`
        )
        .forEach(
            checkbox => {

                checkbox.checked =
                    set.has(
                        normalise(
                            checkbox.value
                        )
                    );

            }
        );

}


function updateAllButtons() {

    document
        .querySelectorAll(
            '[data-all-filter]'
        )
        .forEach(
            button => {

                const filter =
                    button.dataset.allFilter;


                let active =
                    false;


                if (
                    filter ===
                    'type'
                ) {

                    active =
                        selectedTypes.size ===
                        FILTER_VALUES.type.length;

                }


                if (
                    filter ===
                    'trennbar'
                ) {

                    active =
                        selectedTrennbar.size ===
                        FILTER_VALUES.trennbar.length;

                }


                if (
                    filter ===
                    'importance'
                ) {

                    active =
                        selectedImportance.size ===
                        FILTER_VALUES.importance.length;

                }


                if (
                    filter ===
                    'demands'
                ) {

                    active =
                        selectedDemands === null;

                }


                if (
                    filter ===
                    'auxiliary'
                ) {

                    active =
                        selectedAuxiliaries.size ===
                        FILTER_VALUES.auxiliary.length;

                }


                button.classList.toggle(
                    'active',
                    active
                );

            }
        );

}


/* =========================================================
   FILTERED ROWS
   ========================================================= */

function getFilteredRows() {

    return rows.filter(
        row => {

            /*
             * TYPE
             */

            const type =
                normalise(
                    row[
                        columnMap.type
                    ]
                );


            if (
                !selectedTypes.has(
                    type
                )
            ) {

                return false;

            }


            /*
             * TRENNBAR
             */

            let trennbar =
                normalise(
                    row[
                        columnMap.trennbar
                    ]
                );


            /*
             * Existing rows with no value
             * are treated as non-separable.
             */

            if (
                !trennbar
            ) {

                trennbar =
                    'non-separable';

            }


            if (
                !selectedTrennbar.has(
                    trennbar
                )
            ) {

                return false;

            }


            /*
             * IMPORTANCE
             */

            const importance =
                normalise(
                    row[
                        columnMap.importance
                    ]
                );


            if (
                !selectedImportance.has(
                    importance
                )
            ) {

                return false;

            }


            /*
             * DEMANDS
             */

            if (
                selectedDemands !== null
            ) {

                const demands =
                    String(
                        row[
                            columnMap.demands
                        ] ?? ''
                    ).trim();


                if (
                    !selectedDemands.has(
                        demands
                    )
                ) {

                    return false;

                }

            }


            /*
             * HILFSVERB
             */

            const auxiliary =
                normalise(
                    row[
                        columnMap.auxiliary
                    ]
                );


            if (
                !selectedAuxiliaries.has(
                    auxiliary
                )
            ) {

                return false;

            }


            /*
             * LEVEL / KAPITEL
             */

            const level =
                String(
                    row[
                        columnMap.level
                    ] ?? ''
                )
                    .trim()
                    .toUpperCase();


            const chapter =
                String(
                    row[
                        columnMap.chapter
                    ] ?? ''
                ).trim();


            if (
                selectedChapters.size > 0
            ) {

                const key =
                    level +
                    ':' +
                    chapter;


                if (
                    !selectedChapters.has(
                        key
                    )
                ) {

                    return false;

                }

            } else {

                if (
                    selectedLevels.size > 0 &&
                    !selectedLevels.has(
                        level
                    )
                ) {

                    return false;

                }

            }


            return true;

        }
    );

}


/* =========================================================
   VISIBLE COLUMNS
   ========================================================= */

function getVisibleColumnKeys() {

    const keys = [];


    /*
     * "more" columns.
     */

    if (
        selectedColumns.has(
            'number'
        ) &&
        validIndex(
            columnMap.number
        )
    ) {

        keys.push(
            columnMap.number
        );

    }

    if (
    selectedColumns.has(
        'level'
    ) &&
    validIndex(
        columnMap.level
    )
) {

    keys.push(
        columnMap.level
    );

}


    if (
        selectedColumns.has(
            'type'
        ) &&
        validIndex(
            columnMap.type
        )
    ) {

        keys.push(
            columnMap.type
        );

    }


    if (
        selectedColumns.has(
            'chapter'
        ) &&
        validIndex(
            columnMap.chapter
        )
    ) {

        keys.push(
            columnMap.chapter
        );

    }


    if (
        selectedColumns.has(
            'importance'
        ) &&
        validIndex(
            columnMap.importance
        )
    ) {

        keys.push(
            columnMap.importance
        );

    }


    if (
        selectedColumns.has(
            'demands'
        ) &&
        validIndex(
            columnMap.demands
        )
    ) {

        keys.push(
            columnMap.demands
        );

    }


    if (
        selectedColumns.has(
            'trennbar'
        ) &&
        validIndex(
            columnMap.trennbar
        )
    ) {

        keys.push(
            columnMap.trennbar
        );

    }


    if (
        selectedColumns.has(
            'auxiliary'
        ) &&
        validIndex(
            columnMap.auxiliary
        )
    ) {

        keys.push(
            columnMap.auxiliary
        );

    }


    /*
     * English infinitive.
     */

    if (
        selectedColumns.has(
            'english'
        ) &&
        validIndex(
            columnMap.english
        )
    ) {

        keys.push(
            columnMap.english
        );

    }


    /*
     * German Infinitiv ALWAYS visible.
     */

    if (
        validIndex(
            columnMap.infinitive
        )
    ) {

        keys.push(
            columnMap.infinitive
        );

    }


    /*
     * Präsens.
     */

    if (
        presentMode ===
        'basic'
    ) {

        keys.push(
            columnMap.presentIch,
            columnMap.presentDu
        );

    }


    if (
        presentMode ===
        'all'
    ) {

        keys.push(
            columnMap.presentIch,
            columnMap.presentDu,
            columnMap.presentEr,
            columnMap.presentIhr
        );

    }


    /*
     * Partizip II.
     */

    if (
        selectedColumns.has(
            'partizip'
        ) &&
        validIndex(
            columnMap.partizip
        )
    ) {

        keys.push(
            columnMap.partizip
        );

    }


    /*
     * Präteritum.
     */

    if (
        pastMode ===
        'basic'
    ) {

        keys.push(
            columnMap.pastIch,
            columnMap.pastDu
        );

    }


    if (
        pastMode ===
        'all'
    ) {

        keys.push(
            columnMap.pastIch,
            columnMap.pastDu,
            columnMap.pastEr,
            columnMap.pastWir,
            columnMap.pastIhr
        );

    }


    return unique(
        keys.filter(
            validIndex
        )
    );

}


/* =========================================================
   COLUMN LABEL
   ========================================================= */

function getColumnLabel(
    index
) {

    if (
        index ===
        columnMap.number
    ) {

        return '#';

    }

    if (
    index ===
    columnMap.level
) {

    return 'level';

}

    if (
        index ===
        columnMap.type
    ) {

        return 'type';

    }


    if (
        index ===
        columnMap.chapter
    ) {

        return 'Kapitel';

    }


    if (
        index ===
        columnMap.importance
    ) {

        return 'importance';

    }


    if (
        index ===
        columnMap.demands
    ) {

        return 'demands';

    }


    if (
        index ===
        columnMap.trennbar
    ) {

        return 'trennbar';

    }


    if (
        index ===
        columnMap.auxiliary
    ) {

        return 'Hilfsverb';

    }


    if (
        index ===
        columnMap.english
    ) {

        return 'infinitive';

    }


    if (
        index ===
        columnMap.infinitive
    ) {

        return 'Infinitiv';

    }


    if (
        index ===
        columnMap.presentIch
    ) {

        return 'ich';

    }


    if (
        index ===
        columnMap.presentDu
    ) {

        return 'du';

    }


    if (
        index ===
        columnMap.presentEr
    ) {

        return 'er';

    }


    if (
        index ===
        columnMap.presentIhr
    ) {

        return 'ihr';

    }


    if (
        index ===
        columnMap.partizip
    ) {

        return 'Partizip II';

    }


    if (
        index ===
        columnMap.pastIch
    ) {

        return 'ich';

    }


    if (
        index ===
        columnMap.pastDu
    ) {

        return 'du';

    }


    if (
        index ===
        columnMap.pastEr
    ) {

        return 'er';

    }


    if (
        index ===
        columnMap.pastWir
    ) {

        return 'wir';

    }


    if (
        index ===
        columnMap.pastIhr
    ) {

        return 'ihr';

    }


    return (
        headers[1]?.[index] ||
        ''
    );

}


/* =========================================================
   COLUMN GROUP
   ========================================================= */

function getColumnGroup(
    index
) {

    if (
        [
            columnMap.presentIch,
            columnMap.presentDu,
            columnMap.presentEr,
            columnMap.presentIhr
        ].includes(
            index
        )
    ) {

        return 'Präsens';

    }


    if (
        [
            columnMap.pastIch,
            columnMap.pastDu,
            columnMap.pastEr,
            columnMap.pastWir,
            columnMap.pastIhr
        ].includes(
            index
        )
    ) {

        return 'Präteritum';

    }


    return '';

}

/* =========================================================
   LUCKY MODE
   ========================================================= */

function pickLuckyRows() {

    const shuffled =
        [...rows];


    /*
     * Fisher-Yates shuffle.
     *
     * The original rows array is never modified.
     */

    for (
        let i = shuffled.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            shuffled[i],
            shuffled[j]
        ] = [
            shuffled[j],
            shuffled[i]
        ];

    }


    return shuffled.slice(
        0,
        Math.min(
            10,
            shuffled.length
        )
    );

}


function exitLuckyMode() {

    luckyMode =
        false;

    luckyRows =
        [];


    const button =
        document.getElementById(
            'luckyButton'
        );


    if (button) {

        button.classList.remove(
            'lucky-active'
        );

    }

}


function activateLuckyMode() {

    luckyMode =
        true;

    luckyRows =
        pickLuckyRows();


    const button =
        document.getElementById(
            'luckyButton'
        );


    if (button) {

        button.classList.add(
            'lucky-active'
        );

    }


    closeAllMenus();

    renderTable();

}


function getDisplayedRows() {

    if (
        luckyMode
    ) {

        return luckyRows;

    }


    return getFilteredRows();

}


/* =========================================================
   RENDER TABLE
   ========================================================= */

function renderTable() {

    const groupHeader =
        document.getElementById(
            'groupHeader'
        );


    const columnHeader =
        document.getElementById(
            'columnHeader'
        );


    const tableBody =
        document.getElementById(
            'tableBody'
        );


    if (
        !groupHeader ||
        !columnHeader ||
        !tableBody
    ) {

        return;

    }


    groupHeader.innerHTML =
        '';


    columnHeader.innerHTML =
        '';


    tableBody.innerHTML =
        '';


    const visibleKeys =
        getVisibleColumnKeys();


    /*
     * First header row.
     */

    let index =
        0;


    while (
        index <
        visibleKeys.length
    ) {

        const key =
            visibleKeys[index];


        const group =
            getColumnGroup(
                key
            );


        if (!group) {

            const th =
                document.createElement(
                    'th'
                );


            th.rowSpan =
                2;


            th.textContent =
                getColumnLabel(
                    key
                );


            groupHeader.appendChild(
                th
            );


            index++;

            continue;

        }


        let span =
            1;


        while (
            index + span <
            visibleKeys.length &&
            getColumnGroup(
                visibleKeys[
                    index + span
                ]
            ) === group
        ) {

            span++;

        }


        const th =
            document.createElement(
                'th'
            );


        th.colSpan =
            span;


        th.textContent =
            group;


        groupHeader.appendChild(
            th
        );


        index +=
            span;

    }


    /*
     * Second header row.
     */

    visibleKeys.forEach(
        key => {

            if (
                !getColumnGroup(
                    key
                )
            ) {

                return;

            }


            const th =
                document.createElement(
                    'th'
                );


            th.textContent =
                getColumnLabel(
                    key
                );


            columnHeader.appendChild(
                th
            );

        }
    );


    /*
     * Rows.
     */

    // const filteredRows =
    //     getFilteredRows();

        const filteredRows =
    getDisplayedRows();


    filteredRows.forEach(
        (
            row,
            rowIndex
        ) => {

            const tr =
                document.createElement(
                    'tr'
                );


            tr.style.animationDelay =
                Math.min(
                    rowIndex * 7,
                    180
                ) +
                'ms';


            visibleKeys.forEach(
                key => {

                    const td =
                        document.createElement(
                            'td'
                        );


                    if (
                        key ===
                        columnMap.number
                    ) {

                        td.textContent =
                            rowIndex + 1;

                    } else {

                        td.textContent =
                            row[key] ??
                            '';

                    }


                    if (
                        key ===
                        columnMap.infinitive
                    ) {

                        td.classList.add(
                            'infinitiv-cell'
                        );

                    }


                    tr.appendChild(
                        td
                    );

                }
            );


            tableBody.appendChild(
                tr
            );

        }
    );


    updateStatus(
        filteredRows.length
    );


    updateTableContainerWidth();

}


/* =========================================================
   STATUS TEXT
   ========================================================= */

function describeFilter(
    selected,
    allValues
) {

    if (
        selected.size === 0
    ) {

        return '';

    }


    if (
        selected.size ===
        allValues.length
    ) {

        return '';

    }


    const selectedValues =
        allValues.filter(
            value =>
                selected.has(
                    value
                )
        );


    if (
        selectedValues.length === 1
    ) {

        return selectedValues[0];

    }


    return selectedValues.join(
        ' and '
    );

}


/* =========================================================
   STATUS BAR
   ========================================================= */

function updateStatus(
    count
) {

    const status =
        document.getElementById(
            'filterStatus'
        );


    if (!status) {

        return;

    }


    /*
     * Lucky mode has its own status.
     *
     * Normal row filters are intentionally
     * not mentioned here because they are
     * not controlling the displayed rows.
     */

    if (
        luckyMode
    ) {

        status.textContent =
            'Lucky selection, ' +
            count +
            ' random verbs';

        status.classList.remove(
            'hidden'
        );

        return;

    }


    const parts =
        [];


    const typeText =
        describeFilter(
            selectedTypes,
            FILTER_VALUES.type
        );


    if (
        typeText
    ) {

        parts.push(
            typeText
        );

    }


    const trennbarText =
        describeFilter(
            selectedTrennbar,
            FILTER_VALUES.trennbar
        );


    if (
        trennbarText
    ) {

        parts.push(
            trennbarText
        );

    }


    const importanceText =
        describeFilter(
            selectedImportance,
            FILTER_VALUES.importance
        );


    if (
        importanceText
    ) {

        parts.push(
            importanceText
        );

    }


    if (
        selectedDemands !== null
    ) {

        const demandsText =
            describeFilter(
                selectedDemands,
                FILTER_VALUES.demands
            );


        if (
            demandsText
        ) {

            parts.push(
                'demands ' +
                demandsText
            );

        }

    }


    const auxiliaryText =
        describeFilter(
            selectedAuxiliaries,
            FILTER_VALUES.auxiliary
        );


    if (
        auxiliaryText
    ) {

        parts.push(
            'goes with ' +
            auxiliaryText
        );

    }


    if (
        selectedChapters.size > 0
    ) {

        const chapterText =
            [
                ...selectedChapters
            ].join(
                ', '
            );


        parts.push(
            'Kap. ' +
            chapterText
        );

    } else if (
        selectedLevels.size === 1
    ) {

        parts.push(
            'Level ' +
            [
                ...selectedLevels
            ][0]
        );

    } else if (
        selectedLevels.size === 0
    ) {

        parts.push(
            'all levels'
        );

    }


    parts.push(
        count +
        (
            count === 1
                ? ' verb'
                : ' verbs'
        )
    );


    status.textContent =
        'Showing ' +
        parts.join(
            ', '
        );


    status.classList.remove(
        'hidden'
    );

}


/* =========================================================
   TABLE WIDTH
   ========================================================= */

function updateTableContainerWidth() {

    const container =
        document.getElementById(
            'tableContainer'
        );


    const table =
        document.getElementById(
            'verbTable'
        );


    if (
        !container ||
        !table ||
        container.classList.contains(
            'hidden'
        )
    ) {

        return;

    }


    container.classList.remove(
        'wide-table'
    );


    requestAnimationFrame(
        () => {

            const tableWidth =
                table.scrollWidth;


            const available =
                window.innerWidth -
                40;


            if (
                tableWidth >
                available
            ) {

                container.classList.add(
                    'wide-table'
                );

            }

        }
    );

}


window.addEventListener(
    'resize',
    updateTableContainerWidth
);


/* =========================================================
   COLUMN PRESETS
   ========================================================= */

function resetColumns() {

    selectedColumns =
        new Set(
            DEFAULT_COLUMNS
        );


    presentMode =
        'basic';


    pastMode =
        'none';


    syncUI();

    renderTable();

}


function showAllColumns() {

 selectedColumns =
    new Set([
        'number',
        'level',
        'type',
        'chapter',
        'importance',
        'demands',
        'trennbar',
        'auxiliary',
        'english',
        'partizip'
    ]);


    presentMode =
        'all';


    pastMode =
        'all';


    syncUI();

    renderTable();

}


/* =========================================================
   RESET
   ========================================================= */

function resetEverything() {

    exitLuckyMode();


    selectedColumns =
        new Set(
            DEFAULT_COLUMNS
        );


    selectedTypes =
        new Set(
            FILTER_VALUES.type
        );


    selectedTrennbar =
        new Set([
            'non-separable'
        ]);


    selectedImportance =
        new Set([
            'must know'
        ]);


    selectedDemands =
        null;


    selectedAuxiliaries =
        new Set(
            FILTER_VALUES.auxiliary
        );


    selectedLevels =
        new Set([
            'A1'
        ]);


    selectedChapters.clear();


    presentMode =
        'basic';


    pastMode =
        'none';


    syncUI();

    renderTable();

}


/* =========================================================
   UI SYNC
   ========================================================= */

function syncColumnUI() {

    document
        .querySelectorAll(
            '[data-column-group]'
        )
        .forEach(
            checkbox => {

                checkbox.checked =
                    selectedColumns.has(
                        checkbox.dataset.columnGroup
                    );

            }
        );

}


function syncModeUI() {

    document
        .querySelectorAll(
            '.mode-option'
        )
        .forEach(
            wrapper => {

                const type =
                    wrapper.dataset.modeType;


                const mode =
                    type === 'present'
                        ? presentMode
                        : pastMode;


                wrapper.querySelector(
                    '.mode-value'
                ).textContent =
                    mode === 'basic'
                        ? 'ich, du'
                        : mode === 'all'
                            ? 'all'
                            : 'none';


                wrapper
                    .querySelectorAll(
                        '.mode-choice'
                    )
                    .forEach(
                        choice => {

                            choice.classList.toggle(
                                'selected',
                                choice.dataset.mode ===
                                    mode
                            );

                        }
                    );

            }
        );

}


function syncUI() {

    syncColumnUI();

    syncModeUI();

    syncFilterUI();

    syncChapterGrid();

}


/* =========================================================
   CONTROLS
   ========================================================= */


   function closeAllSubmenus() {

    /*
     * Close More.
     */

    document
        .querySelectorAll(
            '.more-control.open'
        )
        .forEach(
            control => {

                control.classList.remove(
                    'open'
                );

            }
        );


    /*
     * Close Präsens / Präteritum
     * submenus.
     */

    document
        .querySelectorAll(
            '.mode-option.open'
        )
        .forEach(
            option => {

                option.classList.remove(
                    'open'
                );

            }
        );

}


function closeAllMenus() {

    /*
     * Close main dropdowns.
     */

    document
        .querySelectorAll(
            '.control.open'
        )
        .forEach(
            control => {

                control.classList.remove(
                    'open'
                );

            }
        );


    /*
     * Close all nested dropdowns too.
     */

    closeAllSubmenus();

}

   function setupControls() {

    /*
     * =====================================================
     * MAIN DROPDOWNS
     * =====================================================
     */

    document
        .querySelectorAll(
            '.control-button'
        )
        .forEach(
            button => {

                button.addEventListener(
                    'click',
                    event => {

                        event.stopPropagation();


                        const control =
                            button.closest(
                                '.control'
                            );


                        const wasOpen =
                            control.classList.contains(
                                'open'
                            );


                        /*
                         * Close ALL main dropdowns
                         * and ALL nested dropdowns.
                         */

                        closeAllMenus();


                        /*
                         * If this dropdown was closed,
                         * open it.
                         */

                        if (
                            !wasOpen
                        ) {

                            control.classList.add(
                                'open'
                            );

                        }

                    }
                );

            }
        );


    /*
     * =====================================================
     * MORE
     * =====================================================
     */

    const moreControl =
        document.getElementById(
            'moreColumnsControl'
        );


    const moreButton =
        moreControl
            ?.querySelector(
                '.more-button'
            );


    if (
        moreControl &&
        moreButton
    ) {

        moreButton.addEventListener(
            'click',
            event => {

                event.stopPropagation();


                const wasOpen =
                    moreControl.classList.contains(
                        'open'
                    );


                /*
                 * Close every nested submenu.
                 */

                closeAllSubmenus();


                /*
                 * Toggle More itself.
                 */

                if (
                    !wasOpen
                ) {

                    moreControl.classList.add(
                        'open'
                    );

                }

            }
        );

    }


    /*
     * =====================================================
     * FILTER CHECKBOXES
     * =====================================================
     */

    document
        .querySelectorAll(
            '[data-filter]'
        )
        .forEach(
            checkbox => {

                checkbox.addEventListener(
                    'change',
                    event => {

                        event.stopPropagation();


                        toggleFilter(
                            checkbox.dataset.filter,
                            checkbox.value
                        );

                    }
                );

            }
        );


    /*
     * =====================================================
     * ALL BUTTONS
     * =====================================================
     */

    document
        .querySelectorAll(
            '[data-all-filter]'
        )
        .forEach(
            button => {

                button.addEventListener(
                    'click',
                    event => {

                        event.stopPropagation();


                        setAllFilter(
                            button.dataset.allFilter
                        );

                    }
                );

            }
        );


    /*
     * =====================================================
     * DEFAULT BUTTONS
     * =====================================================
     */

    document
        .querySelectorAll(
            '[data-default-filter]'
        )
        .forEach(
            button => {

                button.addEventListener(
                    'click',
                    event => {

                        event.stopPropagation();


                        setDefaultFilter(
                            button.dataset.defaultFilter
                        );

                    }
                );

            }
        );


    /*
     * =====================================================
     * KAPITEL
     * =====================================================
     */

    document
        .getElementById(
            'chapterAllButton'
        )
        .addEventListener(
            'click',
            event => {

                event.stopPropagation();

                setAllChapters();

            }
        );


    document
        .getElementById(
            'chapterDefaultButton'
        )
        .addEventListener(
            'click',
            event => {

                event.stopPropagation();

                setDefaultChapters();

            }
        );


    /*
     * =====================================================
     * COLUMN PRESETS
     * =====================================================
     */

    document
        .getElementById(
            'showAllColumns'
        )
        .addEventListener(
            'click',
            event => {

                event.stopPropagation();

                showAllColumns();

            }
        );


    document
        .getElementById(
            'defaultColumns'
        )
        .addEventListener(
            'click',
            event => {

                event.stopPropagation();

                resetColumns();

            }
        );





    /*
     * =====================================================
     * RESET
     * =====================================================
     */

    document
        .getElementById(
            'resetButton'
        )
        .addEventListener(
            'click',
            event => {

                event.stopPropagation();

                closeAllMenus();

                resetEverything();

            }
        );


            /*
     * =====================================================
     * I'M FEELING LUCKY
     * =====================================================
     */

    document
        .getElementById(
            'luckyButton'
        )
        .addEventListener(
            'click',
            event => {

                event.stopPropagation();

                closeAllMenus();

                activateLuckyMode();

            }
        );

    /*
     * =====================================================
     * PRINT
     * =====================================================
     */

    document
        .getElementById(
            'printButton'
        )
        .addEventListener(
            'click',
            event => {

                event.stopPropagation();

                closeAllMenus();

                openPrintSettings();

            }
        );


    /*
     * =====================================================
     * CLICK OUTSIDE
     * =====================================================
     */

    document.addEventListener(
        'click',
        event => {

            /*
             * Clicking anywhere outside the
             * controls closes everything.
             */

            if (
                !event.target.closest(
                    '.control'
                )
            ) {

                closeAllMenus();

            }

        }
    );


    /*
     * =====================================================
     * ESCAPE
     * =====================================================
     */

    document.addEventListener(
        'keydown',
        event => {

            if (
                event.key ===
                'Escape'
            ) {

                closeAllMenus();

                closePrintSettings();

            }

        }
    );


    /*
     * =====================================================
     * PRINT
     * =====================================================
     */

    document
        .getElementById(
            'printClose'
        )
        .addEventListener(
            'click',
            closePrintSettings
        );


    document
        .getElementById(
            'printCancel'
        )
        .addEventListener(
            'click',
            closePrintSettings
        );


    document
        .querySelector(
            '.print-modal-backdrop'
        )
        .addEventListener(
            'click',
            closePrintSettings
        );


    document
        .getElementById(
            'printConfirm'
        )
        .addEventListener(
            'click',
            confirmPrint
        );


    /*
     * =====================================================
     * PRINT OPTION CHANGES
     * =====================================================
     */

    document
        .querySelectorAll(
            'input[name="printPaper"], input[name="printOrientation"]'
        )
        .forEach(
            input => {

                input.addEventListener(
                    'change',
                    updatePrintSummary
                );

            }
        );

}


/* =========================================================
   PRINT
   ========================================================= */

function openPrintSettings() {

    const count =
        getVisibleColumnKeys().length;


    const landscape =
        count > 5;


    document
        .getElementById(
            'orientationLandscape'
        )
        .checked =
        landscape;


    document
        .getElementById(
            'orientationPortrait'
        )
        .checked =
        !landscape;


    document
        .getElementById(
            'paperA4'
        )
        .checked =
        true;


    document
        .getElementById(
            'paperA3'
        )
        .checked =
        false;


    updatePrintSummary();


    document
        .getElementById(
            'printModal'
        )
        .classList.remove(
            'hidden'
        );

}


function closePrintSettings() {

    document
        .getElementById(
            'printModal'
        )
        .classList.add(
            'hidden'
        );

}


function updatePrintSummary() {

    // const rowCount =
    //     getFilteredRows().length;

        const rowCount =
    getDisplayedRows().length;


    const columnCount =
        getVisibleColumnKeys().length;


    const paper =
        document.querySelector(
            'input[name="printPaper"]:checked'
        )?.value ||
        'A4';


    const orientation =
        document.querySelector(
            'input[name="printOrientation"]:checked'
        )?.value ||
        'landscape';


    document
        .getElementById(
            'printSummary'
        )
        .textContent =
        `${rowCount} verbs · ` +
        `${columnCount} columns · ` +
        `${paper} · ` +
        `${orientation}`;

}


function confirmPrint() {

    const paper =
        document.querySelector(
            'input[name="printPaper"]:checked'
        )?.value ||
        'A4';


    const orientation =
        document.querySelector(
            'input[name="printOrientation"]:checked'
        )?.value ||
        'landscape';


    const oldStyle =
        document.getElementById(
            'dynamicPrintPage'
        );


    if (
        oldStyle
    ) {

        oldStyle.remove();

    }


    const style =
        document.createElement(
            'style'
        );


    style.id =
        'dynamicPrintPage';


    style.textContent = `
        @media print {

            @page {

                size:
                    ${paper}
                    ${orientation};

                margin:
                    10mm;

            }

        }
    `;


    document.head.appendChild(
        style
    );


    closePrintSettings();


    requestAnimationFrame(
        () => {

            requestAnimationFrame(
                () => {

                    window.print();

                }
            );

        }
    );

}


window.addEventListener(
    'afterprint',
    () => {

        const style =
            document.getElementById(
                'dynamicPrintPage'
            );


        if (
            style
        ) {

            style.remove();

        }

    }
);


/* =========================================================
   ERROR
   ========================================================= */

function showError(
    message
) {

    const loading =
        document.getElementById(
            'loading'
        );


    const error =
        document.getElementById(
            'error'
        );


    if (loading) {

        loading.classList.add(
            'hidden'
        );

    }


    if (error) {

        error.textContent =
            message;

        error.classList.remove(
            'hidden'
        );

    }

}


/* =========================================================
   START
   ========================================================= */

loadData();