const apiKey = "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";
const maxImages = 4;

function disableGenerateButton() {
    document.getElementById("generate").disabled = true;
}

function enableGenerateButton() {
    document.getElementById("generate").disabled = false;
}

function clearImageGrid() {
    document.getElementById("image-grid").innerHTML = "";
}

async function generateImages(input) {
    disableGenerateButton();
    clearImageGrid();
    document.getElementById("loading").style.display = "block";

    try {
        const imageUrls = await Promise.all(Array.from({ length: maxImages }, async (_, index) => {
            const randomNumber = Math.floor(Math.random() * 10000) + 1;
            const prompt = `${input} ${randomNumber}`;

            const response = await fetch("https://api-inference.huggingface.co/models/prompthero/openjourney", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`,
                },
                body: JSON.stringify({ inputs: prompt }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate image!");
            }

            const blob = await response.blob();
            return URL.createObjectURL(blob);
        }));

        const imageGrid = document.getElementById("image-grid");
        imageUrls.forEach((imageUrl, index) => {
            const img = document.createElement("img");
            img.src = imageUrl;
            img.alt = `art-${index + 1}`;
            img.onclick = () => downloadImage(imageUrl, index);
            imageGrid.appendChild(img);
        });

    } catch (error) {
        console.error("Error generating images:", error);
        alert("Failed to generate images!");
    } finally {
        document.getElementById("loading").style.display = "none";
        enableGenerateButton();
    }
}

document.getElementById("generate").addEventListener('click', () => {
    const input = document.getElementById("user-prompt").value;
    generateImages(input);
});

function downloadImage(imgUrl, imageNumber) {
    const link = document.createElement("a");
    link.href = imgUrl;
    link.download = `image-${imageNumber + 1}.jpg`;
    link.click();
}



