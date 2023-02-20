// setup canvas parameter
var margin = 30, width = 1000, height = 500, rValue = [2, 15];
var circle, xScale, yScale;

var svg = d3.select('#chart')
    .append('svg')
    .attr('width', width+'px')
    .attr('height', height+'px');


// import data
d3.csv('./data/boston-housing.csv').then(function(data){

    data = data.sort(function(a, b){
        return a.charles - b.charles;
    });
    
    // 1. determine the max and min
    xMinMax = d3.extent(data, function(d){
        return parseFloat(d.poor);
    });

    yMinMax = d3.extent(data, function(d){
        return parseFloat(d.rooms);
    });

    rMinMax = d3.extent(data, function(d){
        return parseFloat(d.value);
    });

    // 2. scale the data
    xScale = d3.scaleLinear()
        .domain([xMinMax[1], xMinMax[0]])
        .range([margin+rValue[1], width - margin - rValue[1]]);

    yScale = d3.scaleLinear()
        .domain([yMinMax[1], yMinMax[0]])
        .range([margin+rValue[1], height - margin - rValue[1]]);

    rScale = d3.scaleLinear()
        .domain([rMinMax[0], rMinMax[1]])
        .range([rValue[0], rValue[1]]);

    cScale = d3.scaleOrdinal()
        .domain([0, 1])
        .range(['#6495ED', '#FF7F50']);

    // 3. map the data
    circle = svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', function(d){ return xScale(d.poor); })
        .attr('cy', function(d){ return yScale(d.rooms); })
        .attr('r', 0)
        .attr('fill', function(d){ return cScale(d.charles); })
        .style('opacity', function(d){ return d.charles == 1 ? 0.5 : 0.3; })
        
        // create tooltip        
        // .on('mouseover', function(d){ 
        //     html = 'X | poor: ' + d.poor + '<br />';
        //     html += 'Y | rooms: ' + d.rooms + '<br />';
        //     html += 'R | value: ' + d.value + '<br />';
        //     html += 'C | charles: ' + d.charles;
        //     d3.select('#tooltip')
        //         .html(html)
        //         .style('left', d3.event.pageX - 100)
        //         .style('top', d3.event.pageY - 150)
        //         .style('opacity', 0.7)
        //         .style("border-radius", "5px");
        // })
        // .on('mouseout', function(){
        //     d3.select('#tooltip')
        //         .style('left', -1000)
        //         .style('opacity', 0);
        // });


        const tooltip = d3.select('#chart')
        .append('div')
        .attr('class', 'tooltip');

        circle.on('mouseover', function(e, d){
            html = 'X | poor: ' + d.poor + '<br />';
            html += 'Y | rooms: ' + d.rooms + '<br />';
            html += 'R | value: ' + d.value + '<br />';
            html += 'C | charles: ' + d.charles;
            let x = +d3.select(this).attr('cx');
            let y = +d3.select(this).attr('cy');
            tooltip.style('visibility', 'visible')
                .style('left', `${x}px`)
                .style('top', `${y}px`)
                .style('opacity', 0.7)
                .style("border-radius", "5px")
                .html(html);
        }).on('mouseout', function(e, d){
            tooltip.style('visibility', 'hidden')
        });


    // draw axis
    xAxis = d3.axisBottom(xScale).ticks(0);
    yAxis = d3.axisLeft(yScale).tickValues([yMinMax[0], yMinMax[1]]);

    xAxisG = svg.append('g')
        .attr('id', 'xAxis')
        .attr('class', 'axis')
        .attr('transform', 'translate(0, '+ (height-margin) +')')
        .call(d3.axisBottom(xScale).ticks(0));
    
    yAxisG = svg.append('g')
        .attr('id', 'yAxis')
        .attr('class', 'axis')
        .attr('transform', 'translate('+ margin +', 0)')
        .call(d3.axisLeft(yScale).tickValues([yMinMax[0], yMinMax[1]]));
    
    svg.append('text')
        .attr('x', xScale(xMinMax[0]))
        .attr('y', yScale(yMinMax[0]) + margin)
        .attr('text-anchor', 'end')
        .attr('class', 'axisLabel')
        .text('High economic-status');

    svg.append('text')
        .attr('x', xScale(xMinMax[1]))
        .attr('y', yScale(yMinMax[0]) + margin)
        .attr('text-anchor', 'start')
        .attr('class', 'axisLabel')
        .text('Low economic-status');
    
    update();

});

function update(){
    circle.transition()
        .delay(function(d,i){
            return i * 10;
        })
        .attr('r', function(d){
            return rScale(d.value);
        });
}

// svg.append('rect')
//     .attr('x', 100)
//     .attr('y', 100)
//     .attr('width', 10)
//     .attr('height', 10);

// svg.append('circle')
//     .attr('cx', 200)
//     .attr('cy', 100)
//     .attr('r', 5);

// svg.append('line')
//     .attr('x1', 300)
//     .attr('y1', 100)
//     .attr('x2', 400)
//     .attr('y2', 200)
//     .attr('stroke', '#000');