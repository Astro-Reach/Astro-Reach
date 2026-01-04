/* ============================================
   AstroReach - Global Script
   Handles:
   - Mobile navigation
   - Star background
   - Member signup + storage
   - Member counter sync
   - Admin controls
   ============================================ */

/* ---------- GLOBAL STORAGE KEYS ---------- */
const MEMBER_KEY = "astroreach_members";
const COUNT_KEY = "astroreach_member_count";

/* ---------- MOBILE MENU ---------- */
function toggleMenu() {
    const menu = document.getElementById("mobileMenu");
    if (menu) menu.classList.toggle("active");
}

/* Close menu when clicking a link */
document.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
        const menu = document.getElementById("mobileMenu");
        if (menu) menu.classList.remove("active");
    }
});

/* ---------- STAR BACKGROUND ---------- */
function generateStars() {
    const starContainer = document.getElementById("stars");
    if (!starContainer) return;

    const starCount = 120;
    starContainer.innerHTML = "";

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement("div");
        star.className = "star";
        star.style.left = Math.random() * 100 + "%";
        star.style.top = Math.random() * 100 + "%";
        star.style.animationDelay = Math.random() * 3 + "s";
        starContainer.appendChild(star);
    }
}

/* ---------- MEMBER STORAGE ---------- */
function getMembers() {
    return JSON.parse(localStorage.getItem(MEMBER_KEY)) || [];
}

function saveMembers(members) {
    localStorage.setItem(MEMBER_KEY, JSON.stringify(members));
    localStorage.setItem(COUNT_KEY, members.length);
    updateMemberDisplays();
}

/* ---------- MEMBER COUNTER ---------- */
function updateMemberDisplays() {
    const members = getMembers();
    const count = members.length;

    const ids = [
        "memberCount",
        "aboutMemberCount",
        "adminCount"
    ];

    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = count;
    });

    updateMemberShowcase(members);
    updateAdminList(members);
}

/* ---------- SIGNUP FORM ---------- */
function submitSignup(event) {
    event.preventDefault();

    const name = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const school = document.getElementById("school").value.trim();
    const country = document.getElementById("country").value.trim();
    const interest = document.getElementById("interest").value;
    const notes = document.getElementById("interests").value.trim();

    if (!name || !email || !country || !interest) {
        alert("Please fill out all required fields.");
        return;
    }

    const members = getMembers();

    // prevent duplicate email signup
    if (members.some(m => m.email === email)) {
        alert("This email is already registered.");
        return;
    }

    members.push({
        name,
        email,
        school,
        country,
        interest,
        notes,
        joined: new Date().toISOString()
    });

    saveMembers(members);

    const success = document.getElementById("successMessage");
    if (success) success.style.display = "block";

    document.getElementById("signupForm").reset();
}

/* ---------- ABOUT PAGE MEMBER SHOWCASE ---------- */
function updateMemberShowcase(members) {
    const container = document.getElementById("memberShowcase");
    if (!container) return;

    if (members.length === 0) {
        container.innerHTML = `
            <p style="text-align:center;color:var(--text-dim)">
                No members yet. Be the first to join!
            </p>`;
        return;
    }

    container.innerHTML = "";
    members.slice(0, 12).forEach(member => {
        const card = document.createElement("div");
        card.className = "member-card";
        card.innerHTML = `
            <h4>${member.name}</h4>
            <p>${member.country}</p>
        `;
        container.appendChild(card);
    });
}

/* ---------- ADMIN PAGE ---------- */
function updateAdminList(members) {
    const list = document.getElementById("memberList");
    if (!list) return;

    if (members.length === 0) {
        list.innerHTML = `<p style="color:var(--text-dim)">No members yet</p>`;
        return;
    }

    list.innerHTML = "";
    members.forEach((m, index) => {
        const row = document.createElement("div");
        row.className = "admin-member-row";
        row.innerHTML = `
            <strong>${m.name}</strong> (${m.country})<br>
            <small>${m.email}</small>
        `;
        list.appendChild(row);
    });
}

/* Manual count override (admin) */
function setManualCount() {
    const value = document.getElementById("manualCount").value;
    if (!value || value < 0) return;

    const members = getMembers();
    localStorage.setItem(COUNT_KEY, value);

    const el = document.getElementById("adminCount");
    if (el) el.textContent = value;
}

/* ---------- INIT ---------- */
document.addEventListener("DOMContentLoaded", () => {
    generateStars();
    updateMemberDisplays();
});
