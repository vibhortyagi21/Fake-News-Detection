const newsText = document.getElementById("newsText");
const charCount = document.getElementById("charCount");

const textButton = document.getElementById("textButton");
const imageButton = document.getElementById("imageButton");

const newsImage = document.getElementById("newsImage");
const fileName = document.getElementById("fileName");

const resultBox = document.getElementById("resultBox");


// ======================================
// Character Counter
// ======================================

newsText.addEventListener("input", function () {
    charCount.innerText = newsText.value.length + " characters";
});


// ======================================
// Analyze Text
// ======================================

textButton.addEventListener("click", async function () {

    const text = newsText.value.trim();

    if (text === "") {
        resultBox.innerHTML = `
            <div class="waiting">
                <div class="waiting-icon">⚠</div>
                <h3>Please enter news text</h3>
                <p>Paste some news content first.</p>
            </div>
        `;
        return;
    }

    resultBox.innerHTML = `
        <div class="waiting">
            <div class="waiting-icon">✦</div>
            <h3>Analyzing news...</h3>
            <p>TruthLens AI is analyzing the content.</p>
        </div>
    `;

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/analyze-text",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text: text
                })
            }
        );

        const data = await response.json();

        if (data.status === "error") {
            showGeminiError(data.details);
            return;
        }

        resultBox.innerHTML = `
            <div class="analysis-result">
                <div class="waiting-icon">✦</div>
                <h3>TruthLens AI Analysis</h3>

                <div class="analysis-text">
                    ${formatAnalysis(data.analysis)}
                </div>
            </div>
        `;

    } catch (error) {

        console.error(error);

        showConnectionError();
    }

});


// ======================================
// Image Selection
// ======================================

newsImage.addEventListener("change", function () {

    if (newsImage.files.length > 0) {

        fileName.innerText =
            "Selected: " + newsImage.files[0].name;

    } else {

        fileName.innerText =
            "No image selected";
    }

});


// ======================================
// Analyze Image
// ======================================

imageButton.addEventListener("click", async function () {

    if (newsImage.files.length === 0) {

        resultBox.innerHTML = `
            <div class="waiting">
                <div class="waiting-icon">⚠</div>
                <h3>Please upload an image</h3>
                <p>Select a news screenshot first.</p>
            </div>
        `;

        return;
    }


    const imageFile = newsImage.files[0];


    resultBox.innerHTML = `
        <div class="waiting">
            <div class="waiting-icon">✦</div>
            <h3>Analyzing image...</h3>
            <p>TruthLens AI is reading the news image.</p>
        </div>
    `;


    const formData = new FormData();

    formData.append("file", imageFile);


    try {

        const response = await fetch(
            "http://127.0.0.1:8000/analyze-image",
            {
                method: "POST",
                body: formData
            }
        );


        const data = await response.json();


        if (data.status === "error") {

            showGeminiError(data.details);
            return;
        }


        resultBox.innerHTML = `
            <div class="analysis-result">

                <div class="waiting-icon">✦</div>

                <h3>TruthLens AI Analysis</h3>

                <div class="analysis-text">
                    ${formatAnalysis(data.analysis)}
                </div>

            </div>
        `;


    } catch (error) {

        console.error(error);

        showConnectionError();
    }

});


// ======================================
// Format Analysis
// ======================================

function formatAnalysis(text) {

    return text
        .replace(/\n/g, "<br>")
        .replace(
            /Verdict:/gi,
            "<strong>Verdict:</strong>"
        )
        .replace(
            /Confidence:/gi,
            "<strong>Confidence:</strong>"
        )
        .replace(
            /Reason:/gi,
            "<strong>Reason:</strong>"
        );
}


// ======================================
// Gemini Error
// ======================================

function showGeminiError(details) {

    console.log("Gemini Error:", details);

    resultBox.innerHTML = `
        <div class="waiting">

            <div class="waiting-icon">⚠</div>

            <h3>AI temporarily unavailable</h3>

            <p>
                Gemini is currently unavailable.
                Please try again later.
            </p>

        </div>
    `;
}


// ======================================
// Connection Error
// ======================================

function showConnectionError() {

    resultBox.innerHTML = `
        <div class="waiting">

            <div class="waiting-icon">⚠</div>

            <h3>Connection Error</h3>

            <p>
                Could not connect to the TruthLens AI backend.
                Make sure FastAPI is running.
            </p>

        </div>
    `;
}