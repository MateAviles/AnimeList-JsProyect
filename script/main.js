const urlBase = "https://api.jikan.moe/v4";

const searchInput = document.getElementById("search");
const animeListDiv = document.getElementById("anime_list");
const userAnimeListDiv = document.getElementById("user_anime_list");

let userAnimeList = JSON.parse(localStorage.getItem("userAnimeList")) || [];

function searchAnimes(animeQuery) {
    Swal.fire({
        title: "Cargando su búsqueda...",
        didOpen: () => {
            Swal.showLoading();

            const query = animeQuery.trim() ? `q=${animeQuery}` : "order_by=popularity";

            fetch(`${urlBase}/anime?limit=16&${query}`)
                .then(data => data.json())
                .then(animes => {
                    renderAnimes(animes.data);
                    searchInput.value = "";
                    Swal.close();
                })
                .catch(error => {
                    console.error("Error al obtener animes:", error);
                    Swal.fire("Error", "No se pudo cargar la búsqueda", "error");
                });
        }
    });
}

searchAnimes("");

function renderAnimes(animeList) {
    animeListDiv.innerHTML = ""; 

    animeList.forEach(anime => {
        let animeListItem = `
            <div class="card m-2" style="width: 18rem;">
                <img src="${anime.images.jpg.image_url}" class="card-img-top" alt="${anime.title}">
                <div class="card-body d-flex flex-column justify-content-end">
                    <h5 class="card-title">${anime.title}</h5>
                    <p class="card-text">${anime.type}</p>
                    <button class="btn btn-success" onclick="addToUserList(${anime.mal_id}, '${anime.title}', '${anime.images.jpg.image_url}')">
                        Agregar a mi lista
                    </button>
                </div>
            </div>`;

        animeListDiv.innerHTML += animeListItem;
    });
}

function addToUserList(id, title, image) {
    if (userAnimeList.some(anime => anime.id === id)) {
        Swal.fire("Este anime ya está en la lista.", "info");
        return;
    }

    const newAnime = { id, title, image };
    userAnimeList.push(newAnime);

    localStorage.setItem("userAnimeList", JSON.stringify(userAnimeList));

    renderUserAnimeList();
}

function renderUserAnimeList() {
    userAnimeListDiv.innerHTML = ""; 

    if (userAnimeList.length === 0) {
        userAnimeListDiv.innerHTML = "<p>No has agregado animes a tu lista.</p>";
        return;
    }

    userAnimeList.forEach(anime => {
        let animeItem = `
            <div class="card m-2" style="width: 18rem;">
                <img src="${anime.image}" class="card-img-top" alt="${anime.title}">
                <div class="card-body d-flex flex-column justify-content-end">
                    <h5 class="card-title">${anime.title}</h5>
                    <button class="btn btn-danger" onclick="removeFromUserList(${anime.id})">
                        Eliminar
                    </button>
                </div>
            </div>`;

        userAnimeListDiv.innerHTML += animeItem;
    });
}

function removeFromUserList(id) {
    userAnimeList = userAnimeList.filter(anime => anime.id !== id);
    localStorage.setItem("userAnimeList", JSON.stringify(userAnimeList));
    renderUserAnimeList();
}

renderUserAnimeList();


searchInput.addEventListener("keypress", evt => {
    if (evt.key === "Enter") {
        searchAnimes(evt.target.value);
    }
});
