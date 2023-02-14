const user = document.getElementById('user');
const height = document.getElementById('height');

const saveBtn = document.getElementById('save');
let bg = 'wavy';
saveBtn.onclick = () => {
    // if (!img) {
    //     const saved = localStorage.user;
    //     if (saved) {
    //         img = JSON.parse(saved).image;
    //     } else {
    //         img = `../icon.png`;
    //     }
    // }

    const userToSave = {
        name: user.value,
        height: height.value,
        background: bg
        // image: img
    }
    localStorage.setItem('user', JSON.stringify(userToSave));
    getContext();
}

const bgSelector = document.querySelectorAll('.bg-selector');
bgSelector.forEach(x => x.onclick = () => {
    bg = x.dataset.bg;
    document.getElementById('user-card-container').classList = null;
    document.getElementById('user-card-container').classList.add(bg);

})



getContext();
function getContext() {
    let userStorage = localStorage.user;
    if (userStorage) {
        userStorage = JSON.parse(userStorage);
        user.value = userStorage.name;
        height.value = userStorage.height;
        document.getElementById('user-display').innerHTML = userStorage.name;
        document.getElementById('height-display').innerHTML = userStorage.height + ' cm';
        document.getElementById('user-card-container').classList = null;

        document.getElementById('user-card-container').classList.add(userStorage.background);
    } else {
        document.getElementById('user-card-container').classList = null;

        document.getElementById('user-card-container').classList.add('wavy');

    }
}


// const profilePicture = document.getElementById("profilePicture");
// let img;
// profilePicture.addEventListener("change", () => {
//     const image = profilePicture.files[0];
//     const reader = new FileReader();

//     reader.readAsDataURL(image);
//     reader.addEventListener('load', () => {
//         img = reader.result;

//     });


// })
