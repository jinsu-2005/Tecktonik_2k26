document.addEventListener('DOMContentLoaded', () => {

    // 0. Falling Stars Logic
    const starContainer = document.querySelector('.stars');
    const starCount = 50;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';

        // Random values for each star
        const tailLength = (Math.random() * (7.5 - 5) + 5).toFixed(2); // 5em to 7.5em
        const topOffset = (Math.random() * 100).toFixed(2); // 0% to 100% of container height
        const fallDuration = (Math.random() * (12 - 6) + 6).toFixed(2); // 6s to 12s
        const fallDelay = (Math.random() * 10).toFixed(2); // 0s to 10s

        star.style.setProperty('--star-tail-length', `${tailLength}em`);
        star.style.setProperty('--top-offset', `${topOffset}%`);
        star.style.setProperty('--fall-duration', `${fallDuration}s`);
        star.style.setProperty('--fall-delay', `${fallDelay}s`);

        starContainer.appendChild(star);
    }

    // 1. Accordion Logic
    const acc = document.getElementsByClassName("accordion");
    for (let i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function () {
            this.classList.toggle("active");
            const panel = this.nextElementSibling;
            if (panel.style.display === "block") {
                panel.style.display = "none";
                this.innerHTML = "View Rules ▾";
            } else {
                panel.style.display = "block";
                this.innerHTML = "Hide Rules ▴";
            }
        });
    }

    // 2. Fetch Registration Count & List on Load
    fetchData();

    // 2.5 Dept "Others" Logic
    const deptSelect = document.getElementById('dept');
    const otherDeptGroup = document.getElementById('otherDeptGroup');
    const otherDeptInput = document.getElementById('otherDept');

    deptSelect.addEventListener('change', () => {
        if (deptSelect.value === 'Others') {
            otherDeptGroup.classList.remove('hidden');
            otherDeptInput.setAttribute('required', 'true');
        } else {
            otherDeptGroup.classList.add('hidden');
            otherDeptInput.removeAttribute('required');
        }
    });

    // 3. Form Submission
    const form = document.getElementById('regForm');
    const statusMsg = document.getElementById('statusMessage');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        statusMsg.textContent = "Processing...";
        statusMsg.style.color = "white";

        // Get Checkbox values
        const checkboxes = document.querySelectorAll('input[name="event"]:checked');
        let events = [];
        checkboxes.forEach((checkbox) => {
            events.push(checkbox.value);
        });

        if (events.length === 0) {
            statusMsg.textContent = "Please select at least one event.";
            statusMsg.style.color = "#ff4444";
            return;
        }

        let finalDept = deptSelect.value;
        if (finalDept === 'Others') {
            finalDept = otherDeptInput.value;
        }

        const formData = {
            name: document.getElementById('name').value,
            college: document.getElementById('college').value,
            dept: finalDept,
            year: document.getElementById('year').value,
            email: document.getElementById('email').value,
            mobile: document.getElementById('mobile').value,
            gender: document.getElementById('gender').value,
            events: events.join('; ') // Semi-colon separated
        };

        try {
            const response = await fetch('/.netlify/functions/api', {
                method: 'POST',
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                statusMsg.textContent = "✅ Registration Successful! See you on Feb 14th.";
                statusMsg.style.color = "#00f3ff";
                form.reset();
                otherDeptGroup.classList.add('hidden'); // Reset hidden Input
                fetchData(); // Refresh count
            } else if (response.status === 409) {
                const errData = await response.json();
                statusMsg.textContent = "❌ " + errData.message;
                statusMsg.style.color = "#ffeb3b"; // Yellow for warning
            } else {
                throw new Error('Server Error');
            }
        } catch (error) {
            statusMsg.textContent = "❌ Submission failed. Please try again.";
            statusMsg.style.color = "#ff4444";
        }
    });

    // 4. View Participants Logic with Password
    const viewBtn = document.getElementById('viewListBtn');
    const listDiv = document.getElementById('participantsList');
    const modal = document.getElementById('passwordModal');
    const unlockBtn = document.getElementById('unlockBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const pwdInput = document.getElementById('adminPassword');
    const pwdError = document.getElementById('pwdError');

    // Set your admin password here
    const ADMIN_PASSWORD = "admin";

    viewBtn.addEventListener('click', () => {
        if (listDiv.classList.contains('hidden')) {
            // Show Modal
            modal.classList.remove('hidden');
            pwdInput.value = ''; // Clear previous input
            pwdError.classList.add('hidden');
            pwdInput.focus();
        } else {
            // Hide List
            listDiv.classList.add('hidden');
            viewBtn.textContent = "View Registered Participants";
        }
    });

    // Handle Unlock
    unlockBtn.addEventListener('click', validatePassword);

    // Allow Enter key to submit
    pwdInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') validatePassword();
    });

    function validatePassword() {
        if (pwdInput.value === ADMIN_PASSWORD) {
            modal.classList.add('hidden');
            listDiv.classList.remove('hidden');
            viewBtn.textContent = "Hide Participants - Authenticated";
        } else {
            pwdError.classList.remove('hidden');
            modal.classList.add('shake'); // Add shake effect class if it existed, or just show text
            setTimeout(() => modal.classList.remove('shake'), 500);
        }
    }

    // Handle Cancel
    cancelBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    // Close modal on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });
});

async function fetchData() {
    try {
        const res = await fetch('/.netlify/functions/api');
        const data = await res.json();

        // Update Count
        document.getElementById('count').textContent = data.length;

        // Update Table
        const tbody = document.getElementById('tableBody');
        tbody.innerHTML = ''; // Clear existing

        data.forEach((student, index) => {
            const tr = document.createElement('tr');

            // Convert semicolon-separated events into individual badges
            const eventTags = student.events.split('; ')
                .map(event => `<span class="event-tag">${event}</span>`)
                .join('');

            tr.innerHTML = `
                <td class="col-index">${index + 1}</td>
                <td>${student.name}</td>
                <td>${student.dept}</td>
                <td>${student.year}</td>
                <td>${student.college}</td>
                <td>${student.email}</td>
                <td>${student.mobile}</td>
                <td>${student.gender}</td>
                <td>${eventTags}</td>
            `;
            tbody.appendChild(tr);
        });

    } catch (err) {
        console.error("Error fetching data", err);
    }
}