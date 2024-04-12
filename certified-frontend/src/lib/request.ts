export const authUser = async () => {
    const userToken = localStorage.getItem("dynamic_authentication_token")
    if (!userToken) {
        return null
    }

    const response = await fetch("/api/func/user", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSON.parse(userToken)}`,
        },
    })

    if (response.ok) {
        const data = await response.json()
        return data
    } else {
        console.error("Failed to fetch user")
    }
    return null
}
