import React, { useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
        display: false, 
    //   position: 'top',
    },
  },
};


export const ChoicesCharts = ({ gameChoiceValues, userChoices }) => {
    function getGameChoicesDescription () {
        let output = {description: [], numChoice: []}

        for (let i=0; i<gameChoiceValues.length; i++) {
            output.description.push(gameChoiceValues[i].description)
            const numUsersMadeChoice = userChoices?.filter(
                (userChoice) => userChoice === gameChoiceValues[i].value
            ).length;
            output.numChoice.push(numUsersMadeChoice)
        }
        return (output)
    }
    console.log(getGameChoicesDescription().description)

    const labels = getGameChoicesDescription().description
    // const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    const data = {
      labels,
      datasets: [
        {
          label: 'Dataset 1',
          data: getGameChoicesDescription().numChoice,
          backgroundColor: '#3DCAD3',
          borderRadius: 8
        },
        
      ],
    };

  return (
    <Bar
      options={options}
      data={data}
      style={{ height: '400px', width: '1000px' }}
    />
  );
};
