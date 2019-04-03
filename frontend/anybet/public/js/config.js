const env = 'LOCAL';

switch(env) {
    case 'LOCAL': {
        window.config = {
            apiUrl : 'http://localhost:8084'
        };
        break;
    }
    
    case 'DEV':  {
        window.config = {
            apiUrl : 'http://localhost:8084'
        };
        break;
    }
    
    case 'PROD': {
        window.config = {
            apiUrl : 'http://localhost:8084'
        };
        break;
    }
}
