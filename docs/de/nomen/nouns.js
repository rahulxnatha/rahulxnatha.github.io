/* =========================================================
   CONFIGURATION
   ========================================================= */

const API_URL =
    "https://script.google.com/macros/s/AKfycbxeoA9ygqQTIAu6r3PP3Kya0C1KkvQSYdOhp6VD6QJLWwR1pgmj2f3nrxpWq-FACJtUNA/exec";


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
        label: "#"
    },

    level: {
        label: "level"
    },

    chapter: {
        label: "Kapitel"
    },

    theme: {
        label: "Thema"
    },

    importance: {
        label: "importance"
    },

    english: {
        label: "noun (in English)"
    },

    masculine: {
        label: "Maskulin"
    },

    feminine: {
        label: "Feminin"
    },

    neuter: {
        label: "Neuter"
    },

    plural: {
        label: "Plural"
    },

    why: {
        label: "Why"
    }

};


/* =========================================================
   FILTER VALUES
   ========================================================= */

const IMPORTANCE_VALUES = [
    "must know",
    "good to know",
    "ignore"
];


/* =========================================================
   DEFAULT COLUMNS
   ========================================================= */

const DEFAULT_COLUMNS =
    new Set([
        "english",
        "masculine",
        "feminine",
        "neuter",
        "plural"
    ]);


let selectedColumns =
    new Set(
        DEFAULT_COLUMNS
    );


/* =========================================================
   FILTER STATE
   ========================================================= */

let selectedLevels =
    new Set([
        "A1"
    ]);


let selectedChapters =
    new Set();


let selectedThemes =
    new Set();


let selectedImportance =
    new Set([
        "must know"
    ]);


/* =========================================================
   HELPERS
   ========================================================= */

function normalise(
    value
) {

    return String(
        value ?? ""
    )
        .trim()
        .toLowerCase()
        .replace(
            /\s+/g,
            " "
        );

}


function validIndex(
    value
) {

    return (
        Number.isInteger(
            value
        ) &&
        value >= 0
    );

}


function unique(
    values
) {

    return [
        ...new Set(
            values
        )
    ];

}


/* =========================================================
   LOAD DATA
   ========================================================= */

async function loadData() {

    const loading =
        document.getElementById(
            "loading"
        );


    const tableContainer =
        document.getElementById(
            "tableContainer"
        );


    const docsNode =
        String(
            localStorage.getItem(
                "DOCSnode"
            ) || ""
        ).trim();


    if (!docsNode) {

        showError(
            "This browser has no DOCSlicense."
        );

        return;

    }


    try {

        const url =
            API_URL +
            "?node=" +
            encodeURIComponent(
                docsNode
            );


        const response =
            await fetch(
                url,
                {
                    method:
                        "GET",

                    cache:
                        "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "HTTP " +
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
                "Access denied or invalid data received."
            );

            return;

        }


        if (loading) {

            loading.classList.add(
                "hidden"
            );

        }


        headers =
            data.headers;

        rows =
            data.data;


        detectColumnMap();


       if (
    !validIndex(
        columnMap.english
    )
) {

    throw new Error(
        "noun (in English) column not found."
    );

}


        if (tableContainer) {

            tableContainer.classList.remove(
                "hidden"
            );

        }


        buildColumnDropdown();

        buildFilterOptions();

        setupControls();

        syncUI();

        renderTable();

    }

    catch (error) {

        console.error(
            "Noun database loading failed:",
            error
        );


        showError(
            "Could not load the noun data."
        );

    }

}


/* =========================================================
   DETECT DATABASE COLUMNS
   ========================================================= */

function detectColumnMap() {

    columnMap =
        {};


const nameRow =
    headers[0] || headers[1] || [];

console.log("HEADERS RECEIVED:", headers);
console.log("NAME ROW:", nameRow);


    nameRow.forEach(
        (
            rawName,
            index
        ) => {

            const name =
                normalise(
                    rawName
                );


            if (
                name === "#"
            ) {

                columnMap.number =
                    index;

                return;

            }


            if (
                name === "level"
            ) {

                columnMap.level =
                    index;

                return;

            }


            if (
                name === "kapitel"
            ) {

                columnMap.chapter =
                    index;

                return;

            }


            if (
                name === "thema"
            ) {

                columnMap.theme =
                    index;

                return;

            }


            if (
                name === "importance"
            ) {

                columnMap.importance =
                    index;

                return;

            }


            if (
                name ===
                "noun (in english)"
            ) {

                columnMap.english =
                    index;

                return;

            }


            if (
                name === "maskulin"
            ) {

                columnMap.masculine =
                    index;

                return;

            }


            if (
                name === "feminin"
            ) {

                columnMap.feminine =
                    index;

                return;

            }


            if (
                name === "neuter"
            ) {

                columnMap.neuter =
                    index;

                return;

            }


            if (
                name === "plural"
            ) {

                columnMap.plural =
                    index;

                return;

            }


            if (
                name === "why"
            ) {

                columnMap.why =
                    index;

            }

        }
    );

}


/* =========================================================
   BUILD COLUMN DROPDOWN
   ========================================================= */

function buildColumnDropdown() {

    const main =
        document.getElementById(
            "mainColumnOptions"
        );


    const more =
        document.getElementById(
            "moreColumnOptions"
        );


    if (
        !main ||
        !more
    ) {

        return;

    }


    main.innerHTML =
        "";


    more.innerHTML =
        `
            <div class="dropdown-section">
                more
            </div>
        `;


    [
        "english",
        "masculine",
        "feminine",
        "neuter",
        "plural"
    ].forEach(
        id => {

            createColumnCheckbox(
                main,
                id
            );

        }
    );


    [
        "number",
        "level",
        "chapter",
        "theme",
        "importance",
        "why"
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
            "label"
        );


    label.className =
        "dropdown-option";


    const checkbox =
        document.createElement(
            "input"
        );


    checkbox.type =
        "checkbox";


    checkbox.dataset.columnGroup =
        id;


    checkbox.checked =
        selectedColumns.has(
            id
        );


    checkbox.addEventListener(
        "change",
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
            "span"
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
   FILTER OPTIONS
   ========================================================= */

function buildFilterOptions() {

    buildDynamicFilter(
        "levelOptions",
        "level",
        rows
            .map(
                row =>
                    String(
                        row[
                            columnMap.level
                        ] ?? ""
                    ).trim()
            )
    );


    buildDynamicFilter(
        "chapterOptions",
        "chapter",
        rows
            .map(
                row =>
                    String(
                        row[
                            columnMap.chapter
                        ] ?? ""
                    ).trim()
            )
    );


    buildDynamicFilter(
        "themeOptions",
        "theme",
        rows
            .map(
                row =>
                    String(
                        row[
                            columnMap.theme
                        ] ?? ""
                    ).trim()
            )
    );


    const importance =
        document.querySelectorAll(
            '[data-filter="importance"]'
        );


    importance.forEach(
        checkbox => {

            checkbox.checked =
                selectedImportance.has(
                    normalise(
                        checkbox.value
                    )
                );

        }
    );

}


/* =========================================================
   DYNAMIC FILTER
   ========================================================= */

function buildDynamicFilter(
    containerId,
    filter,
    values
) {

    const container =
        document.getElementById(
            containerId
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        "";


    const uniqueValues =
        unique(
            values.filter(
                value =>
                    value !== ""
            )
        );


    uniqueValues.sort(
        (a, b) =>
            a.localeCompare(
                b,
                undefined,
                {
                    numeric:
                        true
                }
            )
    );


    uniqueValues.forEach(
        value => {

            const label =
                document.createElement(
                    "label"
                );


            label.className =
                "dropdown-option";


            const checkbox =
                document.createElement(
                    "input"
                );


            checkbox.type =
                "checkbox";


            checkbox.value =
                value;


            checkbox.dataset.filter =
                filter;


            checkbox.addEventListener(
                "change",
                event => {

                    event.stopPropagation();

                    toggleFilter(
                        filter,
                        value
                    );

                }
            );


            const text =
                document.createElement(
                    "span"
                );


            text.textContent =
                value;


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
    );


}


/* =========================================================
   FILTER ACTIONS
   ========================================================= */

function toggleFilter(
    filter,
    value
) {

    let set;


    if (
        filter ===
        "level"
    ) {

        set =
            selectedLevels;

    }


    if (
        filter ===
        "chapter"
    ) {

        set =
            selectedChapters;

    }


    if (
        filter ===
        "theme"
    ) {

        set =
            selectedThemes;

    }


    if (
        filter ===
        "importance"
    ) {

        set =
            selectedImportance;

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


    syncFilterUI();

    renderTable();

}


/* =========================================================
   ALL FILTER
   ========================================================= */

function setAllFilter(
    filter
) {

    if (
        filter ===
        "level"
    ) {

        selectedLevels =
            new Set(
                rows
                    .map(
                        row =>
                            String(
                                row[
                                    columnMap.level
                                ] ?? ""
                            )
                            .trim()
                            .toUpperCase()
                    )
                    .filter(
                        Boolean
                    )
            );

    }


    if (
        filter ===
        "chapter"
    ) {

        selectedChapters =
            new Set(
                rows
                    .map(
                        row =>
                            String(
                                row[
                                    columnMap.chapter
                                ] ?? ""
                            ).trim()
                    )
                    .filter(
                        Boolean
                    )
            );

    }


    if (
        filter ===
        "theme"
    ) {

        selectedThemes =
            new Set(
                rows
                    .map(
                        row =>
                            normalise(
                                row[
                                    columnMap.theme
                                ]
                            )
                    )
                    .filter(
                        Boolean
                    )
            );

    }


    if (
        filter ===
        "importance"
    ) {

        selectedImportance =
            new Set(
                IMPORTANCE_VALUES
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

    if (
        filter ===
        "level"
    ) {

        selectedLevels =
            new Set([
                "A1"
            ]);

    }


    if (
        filter ===
        "chapter"
    ) {

        selectedChapters.clear();

    }


    if (
        filter ===
        "theme"
    ) {

        selectedThemes.clear();

    }


    if (
        filter ===
        "importance"
    ) {

        selectedImportance =
            new Set([
                "must know"
            ]);

    }


    syncFilterUI();

    renderTable();

}


/* =========================================================
   FILTER UI
   ========================================================= */

function syncFilterUI() {

    syncDynamicCheckboxGroup(
        "level",
        selectedLevels
    );


    syncDynamicCheckboxGroup(
        "chapter",
        selectedChapters
    );


    syncDynamicCheckboxGroup(
        "theme",
        selectedThemes
    );


    syncDynamicCheckboxGroup(
        "importance",
        selectedImportance
    );

}


function syncDynamicCheckboxGroup(
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


/* =========================================================
   FILTERED ROWS
   ========================================================= */

function getFilteredRows() {

    return rows.filter(
        row => {

           const level =
    normalise(
        row[
            columnMap.level
        ]
    );


const selectedLevelKeys =
    new Set(
        [
            ...selectedLevels
        ].map(
            normalise
        )
    );


if (
    selectedLevelKeys.size > 0 &&
    !selectedLevelKeys.has(
        level
    )
) {

    return false;

}


            const chapter =
                String(
                    row[
                        columnMap.chapter
                    ] ?? ""
                ).trim();


            if (
                selectedChapters.size > 0 &&
                !selectedChapters.has(
                    chapter
                )
            ) {

                return false;

            }


            const theme =
                normalise(
                    row[
                        columnMap.theme
                    ]
                );


            if (
                selectedThemes.size > 0 &&
                !selectedThemes.has(
                    theme
                )
            ) {

                return false;

            }


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


            return true;

        }
    );

}


/* =========================================================
   VISIBLE COLUMNS
   ========================================================= */

function getVisibleColumnKeys() {

    const keys =
        [];


    [
        "number",
        "level",
        "chapter",
        "theme",
        "importance",
        "english",
        "masculine",
        "feminine",
        "neuter",
        "plural",
        "why"
    ].forEach(
        id => {

            if (
                selectedColumns.has(
                    id
                ) &&
                validIndex(
                    columnMap[id]
                )
            ) {

                keys.push(
                    columnMap[id]
                );

            }

        }
    );


    return unique(
        keys
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

        return "#";

    }


    if (
        index ===
        columnMap.level
    ) {

        return "level";

    }


    if (
        index ===
        columnMap.chapter
    ) {

        return "Kapitel";

    }


    if (
        index ===
        columnMap.theme
    ) {

        return "Thema";

    }


    if (
        index ===
        columnMap.importance
    ) {

        return "importance";

    }


    if (
        index ===
        columnMap.english
    ) {

        return "noun (in English)";

    }


    if (
        index ===
        columnMap.masculine
    ) {

        return "Maskulin";

    }


    if (
        index ===
        columnMap.feminine
    ) {

        return "Feminin";

    }


    if (
        index ===
        columnMap.neuter
    ) {

        return "Neuter";

    }


    if (
        index ===
        columnMap.plural
    ) {

        return "Plural";

    }


    if (
        index ===
        columnMap.why
    ) {

        return "Why";

    }


    return (
        headers[1]?.[index] ||
        ""
    );

}


/* =========================================================
   RENDER TABLE
   ========================================================= */

function renderTable() {

    const groupHeader =
        document.getElementById(
            "groupHeader"
        );


    const columnHeader =
        document.getElementById(
            "columnHeader"
        );


    const tableBody =
        document.getElementById(
            "tableBody"
        );


    if (
        !groupHeader ||
        !columnHeader ||
        !tableBody
    ) {

        return;

    }


    groupHeader.innerHTML =
        "";


    columnHeader.innerHTML =
        "";


    tableBody.innerHTML =
        "";


    const visibleKeys =
        getVisibleColumnKeys();


    visibleKeys.forEach(
        key => {

            const th =
                document.createElement(
                    "th"
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

        }
    );


    const filteredRows =
        getFilteredRows();


    filteredRows.forEach(
        (
            row,
            rowIndex
        ) => {

            const tr =
                document.createElement(
                    "tr"
                );


            visibleKeys.forEach(
                key => {

                    const td =
                        document.createElement(
                            "td"
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
                            "";

                    }


                    if (
                        key ===
                        columnMap.english
                    ) {

                        td.classList.add(
                            "noun-cell"
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

    alignGrammarColumns();

}


/* =========================================================
   STATUS
   ========================================================= */

function describeFilter(
    selected,
    allValues
) {

    if (
        selected.size ===
        0
    ) {

        return "";

    }


    if (
        selected.size ===
        allValues.length
    ) {

        return "";

    }


    const selectedValues =
        allValues.filter(
            value =>
                selected.has(
                    normalise(
                        value
                    )
                )
        );


    if (
        selectedValues.length ===
        1
    ) {

        return selectedValues[0];

    }


    return selectedValues.join(
        " and "
    );

}


function updateStatus(
    count
) {

    const status =
        document.getElementById(
            "filterStatus"
        );


    if (!status) {

        return;

    }


    const parts =
        [];


    const levels =
        describeFilter(
            selectedLevels,
            [
                ...new Set(
                    rows.map(
                        row =>
                            String(
                                row[
                                    columnMap.level
                                ] ?? ""
                            )
                                .trim()
                                .toUpperCase()
                    )
                )
            ]
        );


    if (levels) {

        parts.push(
            "Level " +
            levels
        );

    }


    if (
        selectedChapters.size > 0
    ) {

        parts.push(
            "Kap. " +
            [
                ...selectedChapters
            ].join(
                ", "
            )
        );

    }


    const themes =
        describeFilter(
            selectedThemes,
            [
                ...new Set(
                    rows.map(
                        row =>
                            String(
                                row[
                                    columnMap.theme
                                ] ?? ""
                            ).trim()
                    )
                )
            ]
        );


    if (themes) {

        parts.push(
            themes
        );

    }


    const importance =
        describeFilter(
            selectedImportance,
            IMPORTANCE_VALUES
        );


    if (importance) {

        parts.push(
            importance
        );

    }


    parts.push(
        count +
        (
            count === 1
                ? " noun"
                : " nouns"
        )
    );


    status.textContent =
        "Showing " +
        parts.join(
            ", "
        );


    status.classList.remove(
        "hidden"
    );

}


/* =========================================================
   COLUMN PRESETS
   ========================================================= */

function resetColumns() {

    selectedColumns =
        new Set(
            DEFAULT_COLUMNS
        );


    syncColumnUI();

    renderTable();

}


function showAllColumns() {

    selectedColumns =
        new Set([
            "number",
            "level",
            "chapter",
            "theme",
            "importance",
            "english",
            "masculine",
            "feminine",
            "neuter",
            "plural",
            "why"
        ]);


    syncColumnUI();

    renderTable();

}


/* =========================================================
   RESET
   ========================================================= */

function resetEverything() {

    selectedColumns =
        new Set(
            DEFAULT_COLUMNS
        );


    selectedLevels =
        new Set([
            "A1"
        ]);


    selectedChapters.clear();

    selectedThemes.clear();


    selectedImportance =
        new Set([
            "must know"
        ]);


    syncUI();

    renderTable();

}


/* =========================================================
   UI SYNC
   ========================================================= */

function syncColumnUI() {

    document
        .querySelectorAll(
            "[data-column-group]"
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


function syncUI() {

    syncColumnUI();

    syncFilterUI();

}


/* =========================================================
   MENUS
   ========================================================= */

function closeAllMenus() {

    document
        .querySelectorAll(
            ".control.open"
        )
        .forEach(
            control => {

                control.classList.remove(
                    "open"
                );

            }
        );


    document
        .querySelectorAll(
            ".more-control.open"
        )
        .forEach(
            control => {

                control.classList.remove(
                    "open"
                );

            }
        );

}


/* =========================================================
   PRINT
   ========================================================= */

function updatePrintSummary() {

    const rowCount =
        getFilteredRows().length;


    const columnCount =
        getVisibleColumnKeys().length;


    const paper =
        document.querySelector(
            'input[name="printPaper"]:checked'
        )?.value ||
        "A4";


    const orientation =
        document.querySelector(
            'input[name="printOrientation"]:checked'
        )?.value ||
        "landscape";


    document
        .getElementById(
            "printSummary"
        )
        .textContent =
        `${rowCount} nouns · ` +
        `${columnCount} columns · ` +
        `${paper} · ` +
        `${orientation}`;

}


function openPrintSettings() {

    updatePrintSummary();


    document
        .getElementById(
            "printModal"
        )
        .classList.remove(
            "hidden"
        );

}


function closePrintSettings() {

    document
        .getElementById(
            "printModal"
        )
        .classList.add(
            "hidden"
        );

}


function confirmPrint() {

    const paper =
        document.querySelector(
            'input[name="printPaper"]:checked'
        )?.value ||
        "A4";


    const orientation =
        document.querySelector(
            'input[name="printOrientation"]:checked'
        )?.value ||
        "landscape";


    const oldStyle =
        document.getElementById(
            "dynamicPrintPage"
        );


    if (oldStyle) {

        oldStyle.remove();

    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "dynamicPrintPage";


    style.textContent =
        `
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


    setTimeout(
        () => {

            window.print();

        },
        120
    );

}


/* =========================================================
   CONTROLS
   ========================================================= */

function setupControls() {

    document
        .querySelectorAll(
            ".control-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();


                        const control =
                            button.closest(
                                ".control"
                            );


                        const wasOpen =
                            control.classList.contains(
                                "open"
                            );


                        closeAllMenus();


                        if (
                            !wasOpen
                        ) {

                            control.classList.add(
                                "open"
                            );

                        }

                    }
                );

            }
        );


    const moreButton =
        document.getElementById(
            "moreButton"
        );


    const moreControl =
        moreButton?.closest(
            ".more-control"
        );


    if (
        moreButton &&
        moreControl
    ) {

        moreButton.addEventListener(
            "click",
            event => {

                event.stopPropagation();


                const wasOpen =
                    moreControl.classList.contains(
                        "open"
                    );


                document
                    .querySelectorAll(
                        ".more-control.open"
                    )
                    .forEach(
                        control => {

                            control.classList.remove(
                                "open"
                            );

                        }
                    );


                if (
                    !wasOpen
                ) {

                    moreControl.classList.add(
                        "open"
                    );

                }

            }
        );

    }


    document
        .querySelectorAll(
            "[data-all-filter]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();


                        setAllFilter(
                            button.dataset.allFilter
                        );

                    }
                );

            }
        );


    document
        .querySelectorAll(
            "[data-default-filter]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();


                        setDefaultFilter(
                            button.dataset.defaultFilter
                        );

                    }
                );

            }
        );


    document
        .querySelectorAll(
            '[data-filter="importance"]'
        )
        .forEach(
            checkbox => {

                checkbox.addEventListener(
                    "change",
                    event => {

                        event.stopPropagation();


                        toggleFilter(
                            "importance",
                            checkbox.value
                        );

                    }
                );

            }
        );


    document
        .getElementById(
            "showAllColumns"
        )
        .addEventListener(
            "click",
            event => {

                event.stopPropagation();

                showAllColumns();

            }
        );


    document
        .getElementById(
            "defaultColumns"
        )
        .addEventListener(
            "click",
            event => {

                event.stopPropagation();

                resetColumns();

            }
        );


    document
        .getElementById(
            "resetButton"
        )
        .addEventListener(
            "click",
            resetEverything
        );


    document
        .getElementById(
            "printButton"
        )
        .addEventListener(
            "click",
            openPrintSettings
        );


    document
        .getElementById(
            "printClose"
        )
        .addEventListener(
            "click",
            closePrintSettings
        );


    document
        .getElementById(
            "printCancel"
        )
        .addEventListener(
            "click",
            closePrintSettings
        );


    document
        .getElementById(
            "printConfirm"
        )
        .addEventListener(
            "click",
            confirmPrint
        );


    document
        .querySelectorAll(
            'input[name="printPaper"], input[name="printOrientation"]'
        )
        .forEach(
            input => {

                input.addEventListener(
                    "change",
                    updatePrintSummary
                );

            }
        );


    document
        .addEventListener(
            "click",
            () => {

                closeAllMenus();

            }
        );

}


/* =========================================================
   ERROR
   ========================================================= */

function showError(
    message
) {

    const loading =
        document.getElementById(
            "loading"
        );


    const tableContainer =
        document.getElementById(
            "tableContainer"
        );


    const error =
        document.getElementById(
            "error"
        );


    if (loading) {

        loading.classList.add(
            "hidden"
        );

    }


    if (tableContainer) {

        tableContainer.classList.add(
            "hidden"
        );

    }


    if (error) {

        error.textContent =
            message;

        error.classList.remove(
            "hidden"
        );

    }

}


/* =========================================================
   START
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadData();

        loadGrammarReference();

    }
);


// -----------------------------

// -----------------------------
/* =========================================================
   GRAMMAR REFERENCE
   ========================================================= */
// -----------------------------
/* =========================================================
   GRAMMAR REFERENCE
   ========================================================= */
/* =========================================================
   GRAMMAR REFERENCE
   ========================================================= */

let grammarHeaders = [];

let grammarRows = [];

let expandedGrammarGroups = new Set();


async function loadGrammarReference() {

    const docsNode =
        String(
            localStorage.getItem(
                "DOCSnode"
            ) || ""
        ).trim();


    if (!docsNode) {

        return;

    }


    const url =
        API_URL +
        "?node=" +
        encodeURIComponent(
            docsNode
        ) +
        "&sheet=NounGRef";


    try {

        const response =
            await fetch(
                url,
                {
                    method:
                        "GET",

                    cache:
                        "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "HTTP " +
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

            return;

        }


        grammarHeaders =
            data.headers;

        grammarRows =
            data.data;


        renderGrammarReference();

    }

    catch (error) {

        console.error(
            "Grammar reference loading failed:",
            error
        );

    }

}



function renderGrammarReference() {

    const container =
        document.getElementById(
            "grammarReferenceContainer"
        );

    const table =
        document.getElementById(
            "grammarReferenceTable"
        );


    if (
        !container ||
        !table
    ) {
        return;
    }


    table.innerHTML =
        "";


    const headerRow =
        grammarHeaders[0] || [];


    /*
     * -----------------------------------------------------
     * HEADER
     * -----------------------------------------------------
     */

    const thead =
        document.createElement(
            "thead"
        );

    const header =
        document.createElement(
            "tr"
        );


    /*
     * Column A is the group identifier.
     * It is deliberately not displayed.
     */

    for (
        let column = 1;
        column < headerRow.length;
        column++
    ) {

        const th =
            document.createElement(
                "th"
            );


        th.textContent =
            headerRow[column] || "";


        header.appendChild(
            th
        );

    }


    thead.appendChild(
        header
    );


    table.appendChild(
        thead
    );


    /*
     * -----------------------------------------------------
     * BODY
     * -----------------------------------------------------
     */

    const tbody =
        document.createElement(
            "tbody"
        );


    let previousGroup =
        null;


    grammarRows.forEach(
        row => {

            /*
             * Column A identifies the group.
             */

            const group =
                String(
                    row[0] ?? ""
                ).trim();


            const isFirstRow =
                group !== previousGroup;


            const isExpanded =
                expandedGrammarGroups.has(
                    group
                );


            const tr =
                document.createElement(
                    "tr"
                );


            /*
             * First row of a group.
             * This becomes the expand/collapse row.
             */

            if (
                isFirstRow &&
                group !== ""
            ) {

                tr.classList.add(
                    "grammar-group-row"
                );


                tr.dataset.group =
                    group;


                if (
                    isExpanded
                ) {

                    tr.classList.add(
                        "grammar-group-row-expanded"
                    );

                }

            }


            /*
             * Child rows remain hidden until
             * their group is expanded.
             */

            if (
                !isFirstRow &&
                !isExpanded
            ) {

                tr.classList.add(
                    "grammar-group-child"
                );

                tr.style.display =
                    "none";

            }


            /*
             * Create the cells.
             *
             * Column A is skipped.
             */

            for (
                let column = 1;
                column < headerRow.length;
                column++
            ) {

                const td =
                    document.createElement(
                        "td"
                    );


                td.textContent =
                    row[column] || "";


                tr.appendChild(
                    td
                );

            }


            tbody.appendChild(
                tr
            );


            previousGroup =
                group;

        }
    );


    table.appendChild(
        tbody
    );


    /*
     * -----------------------------------------------------
     * EXPAND / COLLAPSE
     * -----------------------------------------------------
     *
     * The entire first row of each group is clickable.
     */

    tbody
        .querySelectorAll(
            ".grammar-group-row"
        )
        .forEach(
            row => {

                row.addEventListener(
                    "click",
                    () => {

                        const group =
                            row.dataset.group;


                        if (
                            expandedGrammarGroups.has(
                                group
                            )
                        ) {

                            expandedGrammarGroups.delete(
                                group
                            );

                        }
                        else {

                            expandedGrammarGroups.add(
                                group
                            );

                        }


                        renderGrammarReference();

                    }
                );

            }
        );


    container.classList.remove(
        "hidden"
    );

    alignGrammarColumns();

}



function alignGrammarColumns() {

    const nounTable =
        document.getElementById("nounTable");

    const grammarTable =
        document.getElementById("grammarReferenceTable");


    if (
        !nounTable ||
        !grammarTable
    ) {
        return;
    }


    const nounHeaderCells =
        nounTable.querySelectorAll(
            "thead tr:first-child th"
        );

    const grammarHeaderCells =
        grammarTable.querySelectorAll(
            "thead tr:first-child th"
        );


    if (
        nounHeaderCells.length < 5 ||
        grammarHeaderCells.length < 5
    ) {
        return;
    }


    /*
     * Bottom table is the master.
     *
     * Bottom: English | Maskulin | Feminin | Neuter | Plural
     * Top:    Aspect  | Maskulin | Feminin | Neuter | Plural
     *
     * Therefore all five column positions must match.
     */

    for (
        let column = 0;
        column < 5;
        column++
    ) {

        const width =
            nounHeaderCells[column]
                .getBoundingClientRect()
                .width;


        grammarTable
            .querySelectorAll(
                `tr > *:nth-child(${column + 1})`
            )
            .forEach(
                cell => {

                    cell.style.width =
                        `${width}px`;

                    cell.style.minWidth =
                        `${width}px`;

                    cell.style.maxWidth =
                        `${width}px`;

                }
            );

    }

}