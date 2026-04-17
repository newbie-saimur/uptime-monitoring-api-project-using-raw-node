const environments = {};

environments.staging = {
    port: 3000,
    envName: 'staging',
    secretKey: 'EaDOqhDrlmqbUoxUrnhKdz3pxm7mKybH',
};

environments.production = {
    port: 5000,
    envName: 'production',
    secretKey: 'gRnbdfv5OlaB3GXFeJ0GVUxwQS8AeVnT',
};

const currentEnvironment =
    typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

const environmentToExport =
    typeof environments[currentEnvironment] === 'object'
        ? environments[currentEnvironment]
        : environments.staging;

module.exports = environmentToExport;
