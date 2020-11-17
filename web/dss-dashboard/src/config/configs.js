//var getUrl = window.location;
// import logo from '../images/';

const configs = {
    //'BASE_URL': getUrl.origin,
    // 'BASE_URL': 'http://172.17.22.45:3333',

    // 'BASE_URL': 'http://localhost:3333',
    'DEV_URL': "http://localhost:3000/url",
    'DEMO_API_URL': "",
    'BASE_URL': '/dashboard-analytics',
    'UPLOAD_URL': '',
    'POWERED_BY': 'Tarento',
    // "APP_LOGO": logo,
    // "APP_LOGO_1X": logo,
    'APP_NAME': '/dashboard/',
    'FILE_UPLOAD':'/filestore/v1/files',
    'FETCH_FILE':'/filestore/v1/files/url',
    'LOCALISATION_URL':"/localization/messages/v1/_search",
    'MDMS': '/egov-mdms-service/v1/_search',
    'SHORTEN_URL':'/egov-url-shortening/shortener',
    'DOC_EXTENSION':['_small','_medium','_large'],
    'CHART_COLOR_CODE':["#35a2eb", "#f19c56", "#4c76c7", "#ff6384", '#FFC107', '#009688', '#9C27B0', '#4CAF50',"#99d4fa", "#179cf4", "#1d9cf4", "#1sacq4", "#1gvcf4"],
    'MODULE_LEVEL':[
                    {'dashboard':null},
                    {'propertytax':{'services_name':'Property Tax','filterKey':'PT'}},
                    {'tradelicense':{'services_name':'Trade licence','filterKey':'TL'}},
                    {'mcollect':{'services_name':'M Collect','filterKey':'MC'}},
                    {'pgr':{'services_name':'PGR','filterKey':'PGR'}},
                    {'ws':{'services_name':'Water','filterKey':'WS'}},
                    {'sw':{'services_name':'Sewerage','filterKey':'SW'}}
                    ],
    'SERVICES': ["Trade licence", "M Collect", "PGR", "Water", "Sewerage"]
    //'SERVICES': ["Property Tax", "Trade licence","PGR", "M Collect"]
}
export default configs;
