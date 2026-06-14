class Bookmark {
    constructor(id, title, url) {
        this.id = id;
        this.title = title;
        this.url = url;
    }
}

class Validator {
    static isValidUrl(url) {
        const pattern = /^(http|https):\/\/[^ "]+$/;
        return pattern.test(url);
    }
    static isNotEmpty(text) {
        return text && text.trim().length > 0;
    }
}

class BookmarkManager {
    constructor() {
        this.bookmarks = [];
    }
    add(title, url) {
        if (!Validator.isNotEmpty(title) || !Validator.isValidUrl(url)) {
            throw new Error("제목과 URL 형식을 확인해 주세요.");
        }
        const newBookmark = new Bookmark(String(Date.now()), title, url);
        this.bookmarks.push(newBookmark);
        return newBookmark;
    }
    delete(id) {
        this.bookmarks = this.bookmarks.filter(b => b.id !== id);
    }
    getAll() {
        return this.bookmarks; 
    }
}


class BookmarkPageState {
    constructor() {
        this.isLoading = false;
        this.errorMessage = "";
    }
    setLoading(status) {
        this.isLoading = status;
        document.getElementById('loadingDisplay').style.display = status ? 'block' : 'none';
    }
    setError(msg) {
        this.errorMessage = msg;
        document.getElementById('errorDisplay').textContent = msg;
    }
}

class InputFormState {
    constructor() {
        this.titleInput = "";
        this.urlInput = "";
        this.isSubmitting = false;
    }
    clearForm() {
        this.titleInput = "";
        this.urlInput = "";
        document.getElementById('titleInput').value = "";
        document.getElementById('urlInput').value = "";
    }
    setSubmitting(status) {
        this.isSubmitting = status;
        document.getElementById('saveBtn').disabled = status;
    }
}

class ListState {
    constructor() {
        this.items = [];
    }
    updateItems(newList) {
        this.items = newList;
    }
}


const manager = new BookmarkManager();
const pageState = new BookmarkPageState();
const formState = new InputFormState();
const listState = new ListState();



function render() {
    const listContainer = document.getElementById('bookmarkList');
    listContainer.innerHTML = "";

    const currentBookmarks = manager.getAll();
    listState.updateItems(currentBookmarks);

    if (listState.items.length === 0) {
        listContainer.innerHTML = "<li>등록된 북마크가 없습니다.</li>";
        return;
    }

    listState.items.forEach(b => {
        const li = document.createElement('li');
        
        
        li.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 4px;">
                <strong style="color: #333; font-size: 15px;">${b.title}</strong>
                <a href="${b.url}" target="_blank" style="color: #007bff; font-size: 13px; text-decoration: none; word-break: break-all;">${b.url}</a>
            </div>
        `;
        
        const delBtn = document.createElement('button');
        delBtn.textContent = "삭제";
        delBtn.className = "del-btn";
        delBtn.onclick = () => {
            if(confirm(`"${b.title}"을(를) 삭제하시겠습니까?`)) {
                pageState.setLoading(true);
                setTimeout(() => {
                    manager.delete(b.id);
                    pageState.setLoading(false);
                    render();
                }, 300);
            }
        };

        li.appendChild(delBtn);
        listContainer.appendChild(li);
    });
}


document.getElementById('titleInput').addEventListener('input', (e) => {
    formState.titleInput = e.target.value;
});
document.getElementById('urlInput').addEventListener('input', (e) => {
    formState.urlInput = e.target.value;
});

document.getElementById('saveBtn').addEventListener('click', () => {
    pageState.setError(""); 
    formState.setSubmitting(true);
    pageState.setLoading(true);

    setTimeout(() => {
        try {
            manager.add(formState.titleInput, formState.urlInput);
            formState.clearForm(); 
            render(); 
        } catch (error) {
            pageState.setError(error.message);
        } finally {
            formState.setSubmitting(false);
            pageState.setLoading(false);
        }
    }, 500);
});

render();