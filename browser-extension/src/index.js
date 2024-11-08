import axios from '../node_modules/axios';

// form fields
const form = document.querySelector('.form-data');

const region1 = document.querySelector('.region-name1');
const region2 = document.querySelector('.region-name2');
const region3 = document.querySelector('.region-name3');

const apiKey = document.querySelector('.api-key');
// results
const errors = document.querySelector('.errors');
const loading = document.querySelector('.loading');
const results = document.querySelector('.result-container');

const usage1 = document.querySelector('.carbon-usage1');
const fossilfuel1 = document.querySelector('.fossil-fuel1');
const myregion1 = document.querySelector('.my-region1');

const usage2 = document.querySelector('.carbon-usage2');
const fossilfuel2 = document.querySelector('.fossil-fuel2');
const myregion2 = document.querySelector('.my-region2');

const usage3 = document.querySelector('.carbon-usage3');
const fossilfuel3 = document.querySelector('.fossil-fuel3');
const myregion3 = document.querySelector('.my-region3');

const clearBtn = document.querySelector('.clear-btn');

const calculateColor = async (value) => {
    let co2Scale = [0, 150, 600, 750, 800];
    let colors = ['#2AA364', '#F5EB4D', '#9E4229', '#381D02', '#381D02'];
    let closestNum = co2Scale.sort((a, b) => {
    return Math.abs(a - value) - Math.abs(b - value);
    })[0];
    console.log(value + ' is closest to ' + closestNum);
    let num = (element) => element > closestNum;
    let scaleIndex = co2Scale.findIndex(num);
    let closestColor = colors[scaleIndex];
    console.log(scaleIndex, closestColor);
    chrome.runtime.sendMessage({ action: 'updateIcon', value: { color: closestColor } });
    };

    const displayCarbonUsage = async (apiKey, region, myregion, usage, fossilfuel) => {
            try {
                await axios
                .get('https://api.co2signal.com/v1/latest', {
                params: {
                countryCode: region
            },
            headers: {
                //please get your own token from CO2Signal https://www.co2signal.com/
                'auth-token': apiKey,
            },
        })
        .then((response) => {
            let CO2 = Math.floor(response.data.data.carbonIntensity);
            calculateColor(CO2);
            loading.style.display = 'none';
            form.style.display = 'none';
            myregion.textContent = region;
            usage.textContent =
                Math.round(response.data.data.carbonIntensity) + ' grams (grams C02 emitted per kilowatt hour)';
            fossilfuel.textContent =
                response.data.data.fossilFuelPercentage.toFixed(2) + '% (percentage of fossil fuels used to generate electricity)';
            results.style.display = 'block';
        });
        } catch (error) {
        console.log(error);
        loading.style.display = 'none';
        results.style.display = 'none';
        errors.textContent = 'Sorry, we have no data for the region you have requested.';
        }
        };

function setUpUser(apiKey, regionName1, regionName2, regionName3) {
    localStorage.setItem('apiKey', apiKey);
    localStorage.setItem('regionName1', regionName1);
    localStorage.setItem('regionName2', regionName2);
    localStorage.setItem('regionName3', regionName3);
    loading.style.display = 'block';
    errors.textContent = '';
    clearBtn.style.display = 'block';
    displayCarbonUsage(apiKey, regionName1, myregion1, usage1, fossilfuel1);
    displayCarbonUsage(apiKey, regionName2, myregion2, usage2, fossilfuel2);
    displayCarbonUsage(apiKey, regionName3, myregion3, usage3, fossilfuel3);
   }

function handleSubmit(e)
{
    e.preventDefault();
    setUpUser(apiKey.value, region1.value, region2.value, region3.value);
}

function init()
{
    const storedApiKey = localStorage.getItem('apiKey');
    const storedRegion = localStorage.getItem('regionName');
    //set icon to be generic green
    //todo
    if (storedApiKey === null || storedRegion === null) {
    form.style.display = 'block';
    results.style.display = 'none';
    loading.style.display = 'none';
    clearBtn.style.display = 'none';
    errors.textContent = '';
    } else {
    displayCarbonUsage(storedApiKey, storedRegion);
    results.style.display = 'none';
    form.style.display = 'none';
    clearBtn.style.display = 'block';
    }

    chrome.runtime.sendMessage({
        action: 'updateIcon',
        value: {
        color: 'green',
        },
       });
};

function reset(e)
{
    e.preventDefault();
    localStorage.removeItem('regionName');
    init();
}

form.addEventListener('submit', (e) => handleSubmit(e));
clearBtn.addEventListener('click', (e) => reset(e));

init();