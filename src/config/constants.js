export const DB_COLUMNS = {
    TRAVEL_TYPE: 'travel_type',
};

export const DISPLAY_AS = {
    BAR_CHART: {
        name: 'Bar Chart',
        value: 'bar',
    },
    COLUMN_CHART: {
        name: 'Column Chart',
        value: 'column',
    },
    TABLE: {
        name: 'Table',
        value: 'table',
    },
    PIE_CHART: {
        name: 'Pie Chart',
        value: 'pie',
    },
};

export const CHART_TYPES = {
    BAR_CHART: {
        name: 'Bar Chart',
        value: 'bar',
    },
    COLUMN_CHART: {
        name: 'Column Chart',
        value: 'column',
    },
    TABLE: {
        name: 'Table',
        value: 'table',
    },
    PIE_CHART: {
        name: 'Pie Chart',
        value: 'pie',
    },
};

export const TRAVEL_TYPES = {
    AIR: {
        label: 'Air',
        id: '1',
    },
    HOTEL: {
        label: 'Hotel',
        id: '2',
    },
    CAR: {
        label: 'Car',
        id: '3',
    },
};

export const COMPARATIVE_COLUMN_REPORTS = {
    COMMISSION: {
        label: 'Commission',
        value: 'commission',
    },
    BOOKINGS: {
        label: 'Bookings',
        value: 'bookings',
    },
    MARKUP: {
        label: 'Markup',
        value: 'markup',
    },
    BASE: {
        label: 'Base',
        value: 'base',
    },
    SEGMENTS: {
        label: 'Segments',
        value: 'segments',
    },
    TOTAL_FARE: {
        label: 'Total Fare',
        value: 'total_fare',
    },
};

export const DATA_TYPES = {
    NUMBER: {
        type: 'number',
        decimals: 2,
        prefix: '$',
        suffix: '',
        prefixPosition: 'left',
    },
    DATES: {
        type: 'date',
        format: 'MM/DD/yyyy',
    },
    SHORT_DATES: {
        type: 'date',
        format: 'MM/DD/YY',
    },
};

export const VENDORS = {
    PRIMARY_VENDOR_SUB_TYPES: ['Intl Air',
        'Dom. Air',
        'Service Fee',
        'Insurance',
        'Misc.',
        'CC Merch Fee Serv',
        'Charge Back Fee',
        'Hotel',
        'Car',
        'Limo',
        'Cruise',
        'Tour',
        'Rail',
        'Seats',
    ],
};

export const FORMAT_DATE = {
    american_format: 'MM/dd/yyyy',
    latin_format: 'dd/MM/yyyy',
    american_format_hyphen: 'MM-dd-yyyy',
    iso_format: 'YYYY-MM-DD',
};

/* --- GLOBAL VARIABLES ---- */

export const DATE_FORMATS = {
    american_format: 'MM/dd/yyyy',
    iso_format: 'YYYY-MM-DD',
    issue_date_table_format: 'MM-DD-YY',
    trip_date_table_format: 'MMM DD, YYYY h:mma', // use this for departure date..etc
};

export const TABLE_COLUMNS_FORMATS = {
    SALES_DOLLAR_FORMAT: {
        type: 'number',
        decimals: 2,
        prefix: '$',
        suffix: '',
        prefixPosition: 'left',
    },
    NUMBER_FORMAT: {
        type: 'number',
        decimals: 0,
        prefix: '',
        suffix: '',
        prefixPosition: 'left',
    },
    PORCENTAGE_FORMAT: {
        type: 'number',
        decimals: 2,
        prefix: '',
        suffix: '%',
    },
};

export const CHARACTER_NUMBER = {
    COL_CONF_NUMBER: 8,
    COL_CLIENT_NAME: 12,
    COL_VENDOR_NAME: 12,
    COL_PASSENGER_NAME: 8,
};

export const TABLES_FORMATS = {
    // Para esas tablas que no son una lista larga, sino una tabla concreta
    CONCRETE: {
        ordering: false,
        paging: false,
        lengthChange: false,
        buttons: [{
            text: 'Export',
            extend: 'excel',
            split: ['excel'],
            className: 'focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 font-medium rounded-md text-sm gap-x-1.5 px-2.5 py-1.5 shadow-sm text-white dark:text-gray-900 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-500 dark:bg-primary-400 dark:hover:bg-primary-500 dark:disabled:bg-primary-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 dark:focus-visible:outline-primary-400 inline-flex items-center',
        }],
        dom: 'lBrtip',
    },
};

export const SEARCH_BY_FILTER_TYPES = {
    text: 1,
    number: 2,
    money: 3,
    alphanumeric: 4,
    date: 5,
    select: 6,
    client: 7,
    vendor: 8,
    multiselect: 9,
    agent: 10,
    travelSubTypes: 11,
};

export const AGENT_REPORT_TYPES = {
    total: 1,
    adjusted: 2,
};

export const DRILLDOWN_REPORTS = {
    current_sales_report: 1,
    airline_production: 2,
    business_earnings_and_cost: 3,
    booking_data_inquiry: 4,
    bookings: 5,
    city_pairs: 6,
    city_pairs_client_airlines: 7,
};

export const BOOKING_GOAL = 240;
export const AGENTS_TEAM_GOAL = 390000;

export const CURRENT_AGENTS = [
    { id: 25, name: 'Concur Concur' },
    { id: 12, name: 'Terry Barnes' },
    { id: 20, name: 'Kenbol Ramos' },
    { id: 13, name: 'Eva Vicuna' },
    { id: 34, name: 'Carmen Sanabria' },
    { id: 17, name: 'Tania Guevara' },
    { id: 22, name: 'Andrea Hernandez' },
    { id: 18, name: 'Denise Martinez' },
    { id: 14, name: 'Jeisa Gutierrez' },
    { id: 23, name: 'Laura Catatayud' },
    { id: 21, name: 'Daniel Riccardi' },
    { id: 24, name: 'Luiza Humberto' },
    { id: 19, name: 'Marcela Ivonne Hernandez' },
    { id: 15, name: 'Ana Maria Cassvan' },
    { id: 16, name: 'Alexandra Saa' },
    { id: 36, name: 'Caroline Gomes' },
];

export const BUSINESS_UNITS = [
    { id: 1, name: 'CORPORATE' },
    { id: 2, name: 'CONSOLIDATOR' },
    { id: 3, name: 'IC UNIT' },
    { id: 4, name: 'LEISURE' },
    { id: 0, name: 'ALL' },
];

export const DATA_INQUIRY_TYPES = {
    booking: 1,
    invoice: 2,
};

export const LOADING_MESSAGES = {
    requesting_report: 'Requesting report wait a moment',
    graphing_report: 'Graphing this may take a moment',
};

export const START_DATE = '2024-01-01';
