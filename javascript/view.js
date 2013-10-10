var JantaView = Backbone.View.extend({

    constants: {
        centerX: 400,
        centerY: 330,
        radius: 300,
        contributorRadius: 25
    },

    initialize: function () {
        this.svg = d3.select(this.el);
        this.connectionScale = d3.scale.linear()
            .domain([0, this.model.getMaximumPairCount()])
            .range([0, 20]);
    },

    render: function () {
        this.drawPairFieldCircle();
        this.drawConnections();
        this.drawContributors();
    },

    drawPairFieldCircle: function () {
        this.svg.append('circle')
            .attr("cx", this.constants.centerX)
            .attr("cy", this.constants.centerY)
            .attr("r", this.constants.radius)
            .attr("class", "pair-field")
    },

    drawContributors: function () {
        var view = this,
            contributorsData = this.model.getContributors();

        var contributors = this.svg.selectAll('.contributors')
            .data(contributorsData)
            .enter()
            .append("svg")
            .attr("data-member", function (d) {
                return d
            })
            .attr("x", function (d, i) {
                var initialPositions = view.getEquidistantPointsOnFieldEdges(contributorsData.length);
                return initialPositions[i * 2] - view.constants.contributorRadius;
            })
            .attr("y", function (d, i) {
                var initialPositions = view.getEquidistantPointsOnFieldEdges(contributorsData.length);
                return initialPositions[i * 2 + 1] - view.constants.contributorRadius;
            });

        contributors.append("polygon")
            .attr("points", function (d) {
                var dim = view.constants.contributorRadius;
                return Util.getPolygon(dim, dim, dim, 6);
            })
            .attr("class", "contributor")
            .on("mouseover", function () {
                $(this).attr("class", "contributor highlight");
            })
            .on("mouseout", function () {
                $(this).attr("class", "contributor");
            })

        _.map(contributorsData, function (contributor) {
            view.updateConnectionsPosition(contributor);
        });
        contributors.call(this.getContributorsMoveHandler());
    },

    drawConnections: function () {
        var view = this;
        var connections = this.svg.selectAll('.connections')
            .data(this.model.getPairingCount())
            .enter()
            .append("g")
            .attr("class", "connection")
            .attr("data-from", function (d) {
                return d[0]
            })
            .attr("data-to", function (d) {
                return d[1]
            });

        connections.append("path")
            .attr("stroke-width", function (d) {
                return view.connectionScale(d[2]);
            });
    },

    getContributorsMoveHandler: function () {
        var view = this;
        return d3.behavior.drag()
            .on("drag", function () {
                var memberName = d3.select(this).attr("data-member");
                var location = view.getContributorLocation(d3.event.x, d3.event.y);
                d3.select(this)
                    .attr("x", function () {
                        return location[0]
                    })
                    .attr("y", function () {
                        return location[1]
                    });
                view.updateConnectionsPosition(memberName);
            });
    },

    getContributorLocation: function (x, y) {
        var distanceFromCenter = Util.getDistance(x, y, this.constants.centerX, this.constants.centerY);
        if (distanceFromCenter < (this.constants.radius + 50)) {
            var closestPoint = Util.getClosestPointOnCircumference(this.constants.centerX, this.constants.centerY, this.constants.radius, x, y);
            return [closestPoint[0] - this.constants.contributorRadius, closestPoint[1] - this.constants.contributorRadius]
        } else {
            return [x, y];
        }
    },

    updateConnectionsPosition: function (contributor) {
        var connections = this.svg.selectAll('.connection');
        var contributorElem = $("[data-member=" + contributor + "]")
        var xPos = parseInt(contributorElem.attr("x")) + this.constants.contributorRadius;
        var yPos = parseInt(contributorElem.attr("y")) + this.constants.contributorRadius;
        connections.selectAll("[data-to=" + contributor + "] path")
            .attr("d", function (d) {
                var currentPath = d3.select(this).attr("d");
                return Util.pathReplaceToPoint(currentPath, xPos, yPos);
            });
        connections.selectAll("[data-from=" + contributor + "] path")
            .attr("d", function (d) {
                var currentPath = d3.select(this).attr("d");
                return Util.pathReplaceFromPoint(currentPath, xPos, yPos);
            });
    },

    getEquidistantPointsOnFieldEdges: function (noOfPoints) {
        return Util.getPolygon(this.constants.centerX, this.constants.centerY, this.constants.radius, noOfPoints);
    }

});