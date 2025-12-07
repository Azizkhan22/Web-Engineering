// Mock API 2
function generateCustomBio(firstName) {
    return new Promise(resolve => {
        setTimeout(() => {
            const bio = `Welcome, ${firstName}! We've created your personalized profile. Our system indicates you are a highly engaged user, eager to explore new technologies.`;
            resolve(bio);
        }, 1500);
    });
}

async function loadUserProfile() {
    const nameEl = document.getElementById('user-name');
    const emailEl = document.getElementById('user-email');
    const bioEl = document.getElementById('user-bio');
    const statusEl = document.getElementById('status');

    try {
        statusEl.textContent = "Loading user data...";

        const response = await fetch('https://randomuser.me/api/');
        const data = await response.json();

        const user = data.results[0];
        const firstName = user.name.first;
        const lastName = user.name.last;
        const email = user.email;

        // Display primary data
        nameEl.textContent = `Name: ${firstName} ${lastName}`;
        emailEl.textContent = `Email: ${email}`;
        statusEl.textContent = "Generating custom bio...";

        // Dependent await
        const bioResult = await generateCustomBio(firstName);
        bioEl.textContent = bioResult;

        statusEl.textContent = "Profile loaded successfully!";
    } catch (error) {
        console.error(error);

        nameEl.textContent = "--- Data Load Failed ---";
        emailEl.textContent = "--- Data Load Failed ---";
        bioEl.textContent = "--- Data Load Failed ---";
        statusEl.textContent = "An error occurred while loading data.";
    }
}

document.getElementById('load-btn').addEventListener('click', loadUserProfile);
