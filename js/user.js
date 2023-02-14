const user = document.getElementById('user');
const height = document.getElementById('height');

const saveBtn = document.getElementById('save');
saveBtn.onclick = () => {


    const userToSave = {
        name: user.value,
        height: height.value,
        image: img
    }
    localStorage.setItem('user', JSON.stringify(userToSave));
    getContext();
}

getContext();
function getContext() {
    let userStorage = localStorage.user;
    if (userStorage) {
        userStorage = JSON.parse(userStorage);
        user.value = userStorage.name;
        height.value = userStorage.height;
        document.getElementById('user-display').innerHTML = userStorage.name;
        document.getElementById('height-display').innerHTML = userStorage.height + ' cm';
        document.getElementById('profile-picture-display').src = userStorage.image;
    }
}


const profilePicture = document.getElementById("profilePicture");
let img;
profilePicture.addEventListener("change", () => {
    const image = profilePicture.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(image);
    reader.addEventListener('load', () => {
        img = reader.result;
        // let user = localStorage.user;
        // if (user) {
        //     user = JSON.parse(user);
        //     user.image = reader.result;
        //     localStorage.setItem('user', JSON.stringify(user));
        // }
    });


})
