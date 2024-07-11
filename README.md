## EV Charging Simulation

This project simulates the charging behavior of electric vehicles (EVs) at charging stations over a year.

<br/>

It aims to determine key metrics such as :
- total energy consumed
- theoretical maximum power demand
- actual maximum power demand
- concurrency factor for different numbers of charging stations.


## Live preview - Deployed on Vercel

This project is responsive and it is deployed on Vercel, it can be viewed live [ev-charging-simulation.vercel.app](https://ev-charging-simulation.vercel.app/).


## Local view 

First:
- Install necessary dependencies

```bash
npm install
```

- Serve the project

```bash
npm run dev
```
Then open project url on your browser.


### Tech used
- NextJS
- ReactJS
- TailwindCSS
- Jest
- Chart.js
- React Charts


### Key Features

 #### Simulation of Charging Stations:

- Simulates up to 30 charging points with specified power over a year in 15-minute intervals.

- Calculates total energy consumption
- theoretical and actual maximum power demand 
- concurrency factor


#### User Interface:

- Allows users to set parameters such as the number of charge points, arrival probability multiplier, and car consumption.

#### Visualization:
I used a mix of tables and charts to visualize the outputs.

##### charts

- Simulation Chart <br />
Provide a visualization of the power usage and charging events over time

###### Features:
- View Modes: Allows the user to view data in different time ranges: day, week, month, and year.

- Chart Types: Provides different views of the data:

- Power Usage: Shows the overall power usage over the selected time range.

- Charging Values: Displays the power usage for each individual charge point.

- Charging Events: Shows the number of charging events over the selected time range.

- Dynamic Data: The chart data dynamically updates based on the selected view mode and chart type.

- Visualization: Uses the  **chart.js**  and  **react-chart** library to render the line charts.



##### Concurrency Factor Chart

Visualizes the concurrency factor (the ratio of actual maximum demand to theoretical maximum demand) for different numbers of charge points.

###### Features:

- Dynamic Data: Displays the concurrency factor for a range of charge points from 1 to 30.

- Responsive Design: Adjusts the chart size based on the viewport for better visualization.


#### Testing:
Unit tests are written to test that the calculations for total energy consumption, theoretical and actual maximum power demand, and concurrency factor are correct.

- To run the tests

```bash
npm test
```
