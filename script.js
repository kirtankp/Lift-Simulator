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

//this func will generates the floor
const generateFloors = (numFloors) => {

    //this is an parent container which hold all the floors
    const floorsContainer = document.createElement('div');
    floorsContainer.id = 'floorsContainer';

    //last floor
    const lastFloor = document.createElement('div');
    lastFloor.className = 'floor';
    lastFloor.id = `Floor ${numFloors}`;
    lastFloor.innerHTML =
        `
        <div class="liftButtons">
            Floor ${numFloors}
            <button class="lift-control down">DOWN</button>
        </div>
    `;
    floorsContainer.appendChild(lastFloor);

    //middle floors
    for (let i = numFloors - 1; i >= 1; i--) {
        const floor = document.createElement('div');
        floor.className = 'floor';
        floor.id = `Floor ${i}`;
        floor.innerHTML =
            `
            <div class="liftButtons">
                <button class="lift-control up">UP</button>
                Floor ${i}
                <button class="lift-control down">DOWN</button>
            </div>
        `;
        floorsContainer.appendChild(floor);
    }

    //ground floor
    const groundFloor = document.createElement('div');
    groundFloor.className = 'floor';
    groundFloor.id = 'Floor 0';
    groundFloor.innerHTML =
        `
        <div class="liftButtons">
            <button class="lift-control up">UP</button>
            Floor 0
        </div>
    `;
    floorsContainer.appendChild(groundFloor);

    //now this whole floorContainer(parent container) will append on body
    document.body.appendChild(floorsContainer);
}

const generateLifts = (numLifts) => {

    //this helps to locate ground floor
    const groundFloor = document.getElementById('Floor 0');

    for (let i = 0; i < numLifts; i++) {
        //lift
        const lifts = document.createElement('div');
        lifts.className = 'lift';
        //leftDoor
        const leftDoor = document.createElement('div');
        leftDoor.className = 'leftDoor';
        //rightDoor
        const rightDoor = document.createElement('div');
        rightDoor.className = 'rightDoor';
        //leftDoor and rightDoor will append to the lift
        lifts.appendChild(leftDoor);
        lifts.appendChild(rightDoor);

        //this lift container will append at ground floor because initially all lifts are at ground floor
        groundFloor.appendChild(lifts);

    }

}