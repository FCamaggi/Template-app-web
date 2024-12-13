class ProgressionService {
    static calculateWarmupSets(targetWeight, targetBorg) {
        const warmupSets = [];
        if (targetBorg >= 6) {
            warmupSets.push(
                { percentage: 50, borg: 4 },
                { percentage: 70, borg: 5 }
            );
        }
        return warmupSets;
    }

    static suggestNextProgression(currentWeight, currentBorg, targetBorg) {
        // Lógica de progresión basada en el rendimiento actual
        return { suggestedWeight: currentWeight * 1.05, suggestedBorg: currentBorg + 1 };
    }
}

module.exports = ProgressionService;