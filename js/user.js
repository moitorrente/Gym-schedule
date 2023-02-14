const user = document.getElementById('user');
const height = document.getElementById('height');

const saveBtn = document.getElementById('save');
saveBtn.onclick = () => {
    let userSaved = localStorage.user;

    const userToSave = {
        name: user.value,
        height: height.value,
        image: JSON.parse(userSaved).image
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

profilePicture.addEventListener("change", () => {
    const image = profilePicture.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(image);
    reader.addEventListener('load', () => {
        let user = localStorage.user;
        if (user) {
            user = JSON.parse(user);
            user.image = reader.result;
            localStorage.setItem('user', JSON.stringify(user));
        }
    });


})
