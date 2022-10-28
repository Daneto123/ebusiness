// изквиква контактите ,за да се покажат
document.addEventListener('DOMContentLoaded', () => {
    getItems();

});


// показва всички модели
function getItems() {
    fetch('http://localhost:3000/phones')
        .then((response) => response.json())
        .then((listItems) => {
            if (listItems && listItems.length !== 0) {
                listItems.map(item => {
                    
                    if(item.name != undefined) {
                        addToSearchContact(item.name);
                    }

                })
            }
        })
}

// показва модели по зададени размери
function getItemBySize(height, width, thickness) {
    fetch('http://localhost:3000/phonesBySize/' + height + '/' + width + '/' + thickness)
        .then((response) => response.json())
        .then((listItems) => {
            if (listItems && listItems.length !== 0) {
                listItems.map(item => {

                    const li = document.createElement('li');
                    const button = createButton(item.color + " " + item.price, 'showInfo(`'+ item.name +  '`,`' + item.color + '`,`' + item.company + '`,`' + item.price + '`,`' + item.availability + '`)');

                    li.appendChild(button);

                    const line = document.createElement('div');
                    line.setAttribute('class', 'lineBtwn');

                    document.querySelector('ul').appendChild(li);
                    document.querySelector('ul').appendChild(line);

                })
            }
        })
}

// показва модели по зададен модел
function getItemByName(name) {
    fetch('http://localhost:3000/phonesByName/' + name)
        .then((response) => response.json())
        .then((listItems) => {
            if (listItems && listItems.length !== 0) {
                listItems.map(item => {

                    const li = document.createElement('li');
                    const button = createButton(item.color + " " + item.price, 'showInfo(`'+ item.name +  '`,`' + item.color + '`,`' + item.company + '`,`' + item.price + '`,`' + item.availability + '`)');

                    li.appendChild(button);

                    const line = document.createElement('div');
                    line.setAttribute('class', 'lineBtwn');

                    document.querySelector('.listPhones').appendChild(li);
                    document.querySelector('.listPhones').appendChild(line);


                })
            }
        })
}


function createButton(textContent, atribute) {
    const button = document.createElement('button');
    button.textContent = textContent;
    button.setAttribute('onclick', atribute);

    return button;
}

function openMain(main, menu){
    const info = document.getElementsByClassName(main)[0].style.display;

    if( info === "" ) {
        document.getElementsByClassName(main)[0].style.display = "block";
        document.getElementsByClassName(menu)[0].style.display = "none";
    }
}

function search(){
    const height = document.getElementById("height").value;
    const width = document.getElementById("width").value;
    const thickness = document.getElementById("thickness").value;

    console.log(height);
    console.log(width);
    console.log(thickness);

    getItemBySize(height, width, thickness);

}

const input = document.getElementById('searchItem')

input.addEventListener("keypress", function(event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
        const name = input.value;
        console.log(name);

        getItemByName(name);
    }

});

function showInfo(name, color, company, price, availability) {
    
    const body = document.querySelector('.phoneInfo');

    const nameField = document.createElement('a');
    nameField.textContent = "Марка/Модел на телефон: " + name;
    body.appendChild(nameField);
    body.appendChild(document.createElement('br'));

    const colorField = document.createElement('a');
    colorField.textContent = "Цвят на калъф: " + color;
    body.appendChild(colorField);
    body.appendChild(document.createElement('br'));

    const companyField = document.createElement('a');
    companyField.textContent = "Име на продавач: " + company;
    body.appendChild(companyField);
    body.appendChild(document.createElement('br'));

    const priceField = document.createElement('a');
    priceField.textContent = "Цена: " + price + "лев";
    body.appendChild(priceField);
    body.appendChild(document.createElement('br'));

    const availabilityField = document.createElement('a');
    if(availabilityField == "0"){
        availabilityField.textContent = "Няма наличност";
    } else {
        availabilityField.textContent = "Наличност: " + availability + "броя";
    }
    body.appendChild(availabilityField);
    body.appendChild(document.createElement('br'));

    const buy = createButton('купи', 'buyBtn(`' + name + '`)');
    body.appendChild(buy);

    const back = createButton('back', 'backBtn()');
    body.appendChild(back);

    document.getElementsByClassName('phoneInfo')[0].style.display = "block";
    document.getElementsByClassName('main')[0].style.display = "none";
    document.getElementsByClassName('menu')[0].style.display = "none";


}

let items = []

// username, id
function addItemCheckCar(id) {

        fetch('http://localhost:3000/addItemCart', {
        method: 'POST',
        body: JSON.stringify({ item: id }),
        //body: JSON.stringify({  user: username, item: id }),

        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })
}

function buyBtn(id) {

    console.log(id);

    addItemCheckCar(id);

}


function backBtn() {
    document.getElementsByClassName('phoneInfo')[0].style.display = "none";
    document.getElementsByClassName('menu')[0].style.display = "block";
}
