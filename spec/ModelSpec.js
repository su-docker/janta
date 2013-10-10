describe("Model", function () {

    beforeEach(function () {
        model = new Model();
        data = [
            {contributor1: "a", contributor2: "B", story: "#454", date: "2013/05/05", message: "Completed all the functionality"},
            {contributor1: "B", contributor2: "D", story: "#44", date: "2013/05/07", message: "Testing pending"},
            {contributor1: "E ", story: "#456", date: "2013/05/15", message: "UI Changes"},
            {contributor1: "A", contributor2: "C", story: "#456", date: "2013/05/15", message: "WIP"},
            {contributor1: "E", story: "#456", date: "2013/05/15", message: "UI Changes"},
            {contributor1: "B", contributor2: "A", story: "#100", date: "2013/02/25", message: "WIP again"},
            {contributor1: "E", story: "#456", date: "2013/05/15", message: "UI Changes"},
            {contributor1: " b ", story: "#456", date: "2013/05/15", message: "More UI Changes"}
        ]
        model.load(data);
    });

    describe("getContributors", function () {
        it("should return all the contributors", function () {
            expect(model.getContributors()).toEqual(["A", "B", "C", "D", "E"])
        });
    });

    describe("getPairingCount", function () {
        it("should return all the pairing combinations count", function () {
            expect(model.getPairingCount()).toEqual(
                [
                    ["A", "B", 2],
                    ["B", "D", 1],
                    ["A", "C", 1]
                ]
            )
        })
    })

    describe("getSoloCount", function () {
        it("should return all the solo contribution count", function () {
            expect(model.getSoloCount()).toEqual(
                {"E": 3, "B": 1}
            )
        })
    })
})
;