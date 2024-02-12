export const config = {
    runtime: "edge"
}

export const handler = async (req) => {
    try {
        const { message } = await req.json();
    } catch(e) {
        console.log("An error occured in sendMessage", e)
    }
}