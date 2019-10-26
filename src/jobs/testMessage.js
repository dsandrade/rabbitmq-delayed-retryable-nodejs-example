const testMessageJob = async (data) => {
    try {
        console.log(data.msg);
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    testMessageJob
};
