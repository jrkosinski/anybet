const env = 'LOCAL';

switch(env) {
    case 'LOCAL': {
        window.config = {
            apiUrl : 'http://localhost:8080'
        };
        break;
    }
    
    case 'DEV':  {
        window.config = {
            apiUrl : 'http://54.89.182.205:4000'
        };
        break;
    }
    
    case 'PROD': {
        window.config = {
            apiUrl : 'http://54.89.182.205:4000'
        };
        break;
    }
}
