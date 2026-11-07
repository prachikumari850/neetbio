import { apiClient } from '@/services/apiClient'

function toBookmark(apiBookmark) {
    return {
        id: apiBookmark.id,
        type: apiBookmark.type,
        title: apiBookmark.title,
        subtitle: apiBookmark.subtitle,
        folder: apiBookmark.folder,
        image: apiBookmark.image ?? undefined,
        link: apiBookmark.link,
        savedAt: apiBookmark.saved_at,
    }
}

function bookmarkPath(itemId) {
    return `/bookmarks/${encodeURIComponent(itemId)}`
}

export async function fetchBookmarks() {
    const { data } = await apiClient.get('/bookmarks')

    return {
        items: data.items.map(toBookmark),
        folders: data.folders,
    }
}

export async function createBookmark(item) {
    const { data } = await apiClient.post('/bookmarks', {
        item_id: item.id,
        type: item.type,
        title: item.title,
        subtitle: item.subtitle,
        folder: item.folder,
        image: item.image,
        link: item.link,
    })

    return toBookmark(data)
}

export async function moveBookmark(itemId, folder) {
    const { data } = await apiClient.patch(bookmarkPath(itemId), { folder })
    return toBookmark(data)
}

export async function deleteBookmark(itemId) {
    await apiClient.delete(bookmarkPath(itemId))
}

export async function clearBookmarks() {
    await apiClient.delete('/bookmarks')
}

export async function createFolder(name) {
    const { data } = await apiClient.post('/bookmarks/folders', { name })
    return data.folders
}