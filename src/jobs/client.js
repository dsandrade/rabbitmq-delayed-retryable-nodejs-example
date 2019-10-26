const { testMessageJob } = require('./testMessage');

const getJobList = () => {
    return {
        'test-message': testMessageJob
    };
};

module.exports = {
    getJobList
};
