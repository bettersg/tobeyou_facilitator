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
  scales: {
    y: {
      grid: {
        color: 'white',
      },
      ticks: {
        stepSize: 1,
        font: {
          size: '18px',
          weight: 700,
          maxWidth: '50px',
        },
      },
    },
    x: {
      ticks: {
        font: {
          size: '18px',
          weight: 700,
          maxWidth: '50px',
        },
      },
    },
  },
};

export const ChoicesCharts = ({ gameChoiceValues, userChoices }) => {
  function getGameChoicesDescription() {
    let output = { description: [], numChoice: [] };

    for (let i = 0; i < gameChoiceValues.length; i++) {
      const maxCharacterCount = Math.round(1000 / gameChoiceValues.length / 16);
      let gameChoiceValuesDescription = gameChoiceValues[i].description;
      if (gameChoiceValuesDescription.length > maxCharacterCount) {
        let descriptionSplit = [];
        let end = maxCharacterCount;
        let start = 0;
        while (end < gameChoiceValuesDescription.length) {
          let hasDash = false;
          if (
            gameChoiceValuesDescription[end - 1] !== ' ' &&
            gameChoiceValuesDescription[end] !== ' ' &&
            end < gameChoiceValuesDescription.length
          ) {
            hasDash = true;
          }
          descriptionSplit.push(
            gameChoiceValuesDescription.slice(start, end) +
              `${hasDash ? '-' : ''}`
          );
          start = end;
          // end = temp + maxCharacterCount
          end = Math.min(
            start + maxCharacterCount,
            gameChoiceValuesDescription.length
          );
        }

        if (end >= gameChoiceValuesDescription.length) {
          descriptionSplit.push(gameChoiceValuesDescription.slice(start, end));
        }
        output.description.push(descriptionSplit);
      } else {
        output.description.push(gameChoiceValuesDescription);
      }

      const numUsersMadeChoice = userChoices?.filter(
        (userChoice) => userChoice === gameChoiceValues[i].value
      ).length;
      output.numChoice.push(numUsersMadeChoice);
    }
    return output;
  }
  console.log(getGameChoicesDescription().description);

  const labels = getGameChoicesDescription().description;

  const data = {
    labels,
    datasets: [
      {
        label: 'Number of Students',
        data: getGameChoicesDescription().numChoice,
        backgroundColor: '#FF8944',
        borderRadius: 8,
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
