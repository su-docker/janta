//TEMP Data
var tempData = [
    {contributor1: "a", contributor2: "B", story: "#454", date: "2013/05/05", message: "Completed all the functionality"},
    {contributor1: "a", contributor2: "B", story: "#454", date: "2013/05/05", message: "Completed all the functionality"},
    {contributor1: "a", contributor2: "B", story: "#454", date: "2013/05/05", message: "Completed all the functionality"},
    {contributor1: "a", contributor2: "B", story: "#454", date: "2013/05/05", message: "Completed all the functionality"},
    {contributor1: "a", contributor2: "B", story: "#454", date: "2013/05/05", message: "Completed all the functionality"},
    {contributor1: "a", contributor2: "B", story: "#454", date: "2013/05/05", message: "Completed all the functionality"},
    {contributor1: "B", contributor2: "D", story: "#44", date: "2013/05/07", message: "Testing pending"},
    {contributor1: "E ", story: "#456", date: "2013/05/15", message: "UI Changes"},
    {contributor1: "A", contributor2: "C", story: "#456", date: "2013/05/15", message: "WIP"},
    {contributor1: "E", story: "#456", date: "2013/05/15", message: "UI Changes"},
    {contributor1: "B", contributor2: "A", story: "#100", date: "2013/02/25", message: "WIP again"},
    {contributor1: "E", story: "#456", date: "2013/05/15", message: "UI Changes"},
    {contributor1: "B", contributor2: "F", story: "#44", date: "2013/05/07", message: "Testing pending"},
    {contributor1: "B", contributor2: "F", story: "#44", date: "2013/05/07", message: "Testing pending"},
    {contributor1: "B", contributor2: "G", story: "#44", date: "2013/05/07", message: "Testing pending"},
    {contributor1: "B", contributor2: "H", story: "#44", date: "2013/05/07", message: "Testing pending"},
    {contributor1: "B", contributor2: "I", story: "#44", date: "2013/05/07", message: "Testing pending"},
    {contributor1: "B", contributor2: "J", story: "#44", date: "2013/05/07", message: "Testing pending"},
    {contributor1: " b ", story: "#456", date: "2013/05/15", message: "More UI Changes"}
]


var JantaModel = Backbone.Model.extend({

    load: function (commitLogs) {
        this.set("commitLogs", commitLogs)
    },

    getContributors: function () {
        var model = this;
        var commitLogs = this.get("commitLogs");
        var contributors = _.collect(commitLogs, function (log) {
            return _.compact([log['contributor1'], log['contributor2']])
        });
        var uniqueContributors = _.uniq(_.map(_.flatten(contributors, true), function (value) {
            return model.cleanseName(value)
        }));
        return _.sortBy(uniqueContributors, function (value) {
            return value
        })
    },

    getPairingCount: function () {
        var model = this;
        var commitLogs = this.get("commitLogs");
        var validPairLogs = _.reject(commitLogs, function (log) {
            return log['contributor2'] == null
        })
        var unique_pairs_count = _.countBy(validPairLogs, function (log) {
            var pair = [model.cleanseName(log['contributor1']),
                model.cleanseName(log['contributor2'])];
            return _.sortBy(pair, function (value) {
                return value;
            })
        });
        return _.map(unique_pairs_count, function (pairCount, pair) {
            return _.flatten([pair.split(','), pairCount])
        });
    },

    getMaximumPairCount: function () {
        var pairingCount = this.getPairingCount();
        var maxValue = _.max(pairingCount, function (d) {
            return d[2];
        });
        return maxValue[2];
    },

    getSoloCount: function () {
        var model = this;
        var commitLogs = this.get("commitLogs");
        var validSoloLogs = _.reject(commitLogs, function (log) {
            return log['contributor2'] != null
        })
        return _.countBy(validSoloLogs, function (log) {
            return model.cleanseName(log['contributor1'])
        });
    },

    cleanseName: function (contributor) {
        return contributor.trim().toUpperCase();
    }
});
