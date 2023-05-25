//this function is called when the form is submitted, when the submit button is pressed.
const Simulation = () => {

    //here we are storing the input value from the form.  
    const numFloors = parseInt(document.getElementById('floors').value);
    const numLifts = parseInt(document.getElementById('lifts').value);

    //this will make the blank body while removing the previous form content
    document.body.innerHTML = "";

    //func. to generate the floors and lifts.
    generateFloors(numFloors);
    generateLifts(numLifts);

}

const generateFloors = (numFloors) => {

    const floorsContainer = document.createElement('div');
    floorsContainer.id = 'floorsContainer';

    //last floor
    const lastFloor = document.createElement('div');
    lastFloor.className = 'floor';
    lastFloor.id = `Floor ${numFloors}`;
    lastFloor.innerHTML = 
    `
    <button class="lift-control down">DOWN</button>
        Floor ${numFloors}
    `;
    floorsContainer.appendChild(lastFloor);

    //middle floors
    for (let i = numFloors - 1; i >= 1; i--) {
        const floor = document.createElement('div');
        floor.className = 'floor';
        floor.id = `Floor ${i}`;
        floor.innerHTML =  
        `
            <button class="lift-control up">UP</button>
            <button class="lift-control down">DOWN</button>
            Floor ${i}
        `;
        floorsContainer.appendChild(floor);
    }

    //ground floor
    const groundFloor = document.createElement('div');
    groundFloor.className = 'floor';
    groundFloor.id = 'Floor 0';
    groundFloor.innerHTML =  
    `
        <button class="lift-control up">UP</button>
        Floor 0
    `;
    floorsContainer.appendChild(groundFloor);

    document.body.appendChild(floorsContainer);
}

const generateLifts = (numLifts) => {

    const liftsContainer = document.createElement('div');
    liftsContainer.id = 'liftsContainer';

    for (let i = 0; i < numLifts; i++) {
        const lift = document.createElement('div');
        lift.className = 'lift';
        lift.innerHTML = `Lift ${i + 1}`;
        liftsContainer.appendChild(lift);
    }
    //this lift container will append at ground floor
    const groundFloor = document.getElementById('Floor 0');
    groundFloor.appendChild(liftsContainer);
}