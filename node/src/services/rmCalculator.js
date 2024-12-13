const calculateBrzyckiRM = (weight, reps) => {
    return weight / (1.0278 - 0.0278 * reps);
};

const calculatePercentageWeight = (rm, percentage) => {
    return rm * (percentage / 100);
};

module.exports = {
    calculateBrzyckiRM,
    calculatePercentageWeight
};