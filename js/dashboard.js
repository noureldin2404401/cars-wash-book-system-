/**
 * dashboard.js — SparkleWash Admin Dashboard
 * Member 4 | Auth Guard + 4 Mock Bookings + Search & Filter
 *
 * - Redirects to admin-login.html if not logged in
 * - 4 mock bookings — one per wash type
 * - Live search by name, email, or phone
 * - Status filter dropdown
 * - Date sort (newest / oldest)
 * - Animated stat card counters
 * - Mobile sidebar toggle
 * - Live clock
 * - Logout button clears session and redirects
 */

document.addEventListener('DOMContentLoaded', function () {

    /* ─────────────────────────────────────────────────────
       1. AUTH GUARD — redirect to login if not logged in
    ───────────────────────────────────────────────────── */
    if (sessionStorage.getItem('adminLoggedIn') !== 'true') {
        window.location.href = 'admin-login.html';
        return;  /* stop the rest of the script */
    }


    /* ─────────────────────────────────────────────────────
       2. MOCK BOOKING DATA — 4 bookings, one per wash type
    ───────────────────────────────────────────────────── */
    var bookings = [
        {
            id: 1,
            name:    'Ahmed Hassan',
            email:   'ahmed.hassan@gmail.com',
            phone:   '01012345678',
            service: 'Basic Wash',
            date:    '2026-07-28',
            time:    '09:00 AM',
            car:     'Toyota Corolla 2022',
            price:   500,
            status:  'Confirmed'
        },
        {
            id: 2,
            name:    'Sara Mohamed',
            email:   'sara.m@outlook.com',
            phone:   '01123456789',
            service: 'Premium Wash',
            date:    '2026-07-29',
            time:    '11:00 AM',
            car:     'Hyundai Elantra 2021',
            price:   750,
            status:  'Pending'
        },
        {
            id: 3,
            name:    'Khaled Ali',
            email:   'k.ali@yahoo.com',
            phone:   '01234567890',
            service: 'VIP Detailing',
            date:    '2026-07-30',
            time:    '02:00 PM',
            car:     'BMW X5 2020',
            price:   1000,
            status:  'Confirmed'
        },
        {
            id: 4,
            name:    'Nour El-Din',
            email:   'noureldeen@gmail.com',
            phone:   '01098765432',
            service: 'Chemical Deep Cleaning',
            date:    '2026-07-31',
            time:    '04:00 PM',
            car:     'Mercedes C200 2022',
            price:   1500,
            status:  'Cancelled'
        }
    ];


    /* ─────────────────────────────────────────────────────
       3. ELEMENT REFERENCES
    ───────────────────────────────────────────────────── */
    var tbody        = document.getElementById('bookings-tbody');
    var searchInput  = document.getElementById('search-input');
    var searchClear  = document.getElementById('search-clear');
    var statusFilter = document.getElementById('status-filter');
    var dateSort     = document.getElementById('date-sort');
    var resultsCount = document.getElementById('results-count');
    var tableEmpty   = document.getElementById('table-empty');
    var resetBtn     = document.getElementById('reset-filters');

    var statTotal     = document.getElementById('stat-total');
    var statConfirmed = document.getElementById('stat-confirmed');
    var statPending   = document.getElementById('stat-pending');
    var statCancelled = document.getElementById('stat-cancelled');

    var sidebar        = document.getElementById('sidebar');
    var sidebarOpen    = document.getElementById('sidebar-open');
    var sidebarClose   = document.getElementById('sidebar-close');
    var sidebarOverlay = document.getElementById('sidebar-overlay');
    var logoutBtn      = document.getElementById('logout-btn');

    var topbarTime = document.getElementById('topbar-time');


    /* ─────────────────────────────────────────────────────
       4. STAT CARDS (animated counter)
    ───────────────────────────────────────────────────── */
    function animateCount(el, target) {
        if (!el) return;
        var start   = 0;
        var duration = 500;
        var startTs = null;

        function step(ts) {
            if (!startTs) startTs = ts;
            var progress = Math.min((ts - startTs) / duration, 1);
            el.textContent = Math.floor(start + (target - start) * progress);
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target;
        }
        requestAnimationFrame(step);
    }

    function updateStats(data) {
        animateCount(statTotal,     data.length);
        animateCount(statConfirmed, data.filter(function (b) { return b.status === 'Confirmed';  }).length);
        animateCount(statPending,   data.filter(function (b) { return b.status === 'Pending';    }).length);
        animateCount(statCancelled, data.filter(function (b) { return b.status === 'Cancelled';  }).length);
    }


    /* ─────────────────────────────────────────────────────
       5. RENDER TABLE ROWS
    ───────────────────────────────────────────────────── */
    var statusIcons = { Confirmed: '✅', Pending: '⏳', Cancelled: '❌' };

    function formatDate(iso) {
        var p = iso.split('-');
        var d = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g,  '&amp;')
            .replace(/</g,  '&lt;')
            .replace(/>/g,  '&gt;')
            .replace(/"/g,  '&quot;');
    }

    function renderTable(data) {
        tbody.innerHTML = '';

        if (data.length === 0) {
            tableEmpty.classList.add('visible');
            resultsCount.textContent = 'No bookings found.';
            updateStats(data);
            return;
        }

        tableEmpty.classList.remove('visible');
        resultsCount.textContent =
            'Showing ' + data.length + ' of ' + bookings.length + ' booking' + (bookings.length !== 1 ? 's' : '');

        data.forEach(function (b, i) {
            var tr = document.createElement('tr');
            tr.innerHTML =
                '<td>' + (i + 1) + '</td>' +
                '<td class="cell-name">'  + escapeHtml(b.name)    + '</td>' +
                '<td class="cell-email">' + escapeHtml(b.email)   + '</td>' +
                '<td>'                    + escapeHtml(b.phone)   + '</td>' +
                '<td><span class="service-badge">' + escapeHtml(b.service) + '</span></td>' +
                '<td>' + formatDate(b.date) + '</td>' +
                '<td>' + escapeHtml(b.time) + '</td>' +
                '<td>' + escapeHtml(b.car)  + '</td>' +
                '<td class="cell-price">' + b.price + ' EGP</td>' +
                '<td><span class="status-badge ' + b.status.toLowerCase() + '">' +
                    (statusIcons[b.status] || '') + ' ' + b.status +
                '</span></td>';
            tbody.appendChild(tr);
        });

        updateStats(data);
    }


    /* ─────────────────────────────────────────────────────
       6. FILTER + SEARCH + SORT
    ───────────────────────────────────────────────────── */
    function applyFilters() {
        var query  = searchInput  ? searchInput.value.trim().toLowerCase() : '';
        var status = statusFilter ? statusFilter.value : 'all';
        var sort   = dateSort     ? dateSort.value     : 'newest';

        var result = bookings.filter(function (b) {
            var matchSearch =
                !query ||
                b.name.toLowerCase().includes(query)  ||
                b.email.toLowerCase().includes(query) ||
                b.phone.includes(query);

            var matchStatus = status === 'all' || b.status === status;

            return matchSearch && matchStatus;
        });

        result.sort(function (a, b) {
            var da = new Date(a.date);
            var db = new Date(b.date);
            return sort === 'newest' ? db - da : da - db;
        });

        renderTable(result);

        if (searchClear) {
            query ? searchClear.classList.add('visible') : searchClear.classList.remove('visible');
        }
    }

    if (searchInput)  searchInput.addEventListener('input',   applyFilters);
    if (statusFilter) statusFilter.addEventListener('change', applyFilters);
    if (dateSort)     dateSort.addEventListener('change',     applyFilters);

    if (searchClear) {
        searchClear.addEventListener('click', function () {
            searchInput.value = '';
            applyFilters();
            searchInput.focus();
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', function () {
            if (searchInput)  searchInput.value  = '';
            if (statusFilter) statusFilter.value = 'all';
            if (dateSort)     dateSort.value      = 'newest';
            applyFilters();
        });
    }


    /* ─────────────────────────────────────────────────────
       7. LOGOUT
    ───────────────────────────────────────────────────── */
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            sessionStorage.removeItem('adminLoggedIn');
            window.location.href = 'admin-login.html';
        });
    }


    /* ─────────────────────────────────────────────────────
       8. MOBILE SIDEBAR TOGGLE
    ───────────────────────────────────────────────────── */
    function openSidebar()  {
        if (sidebar)        sidebar.classList.add('open');
        if (sidebarOverlay) sidebarOverlay.classList.add('visible');
    }
    function closeSidebar() {
        if (sidebar)        sidebar.classList.remove('open');
        if (sidebarOverlay) sidebarOverlay.classList.remove('visible');
    }

    if (sidebarOpen)    sidebarOpen.addEventListener('click',    openSidebar);
    if (sidebarClose)   sidebarClose.addEventListener('click',   closeSidebar);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);


    /* ─────────────────────────────────────────────────────
       9. LIVE CLOCK
    ───────────────────────────────────────────────────── */
    function updateClock() {
        if (!topbarTime) return;
        topbarTime.textContent = new Date().toLocaleTimeString('en-GB', {
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
    }
    setInterval(updateClock, 1000);
    updateClock();


    /* ─────────────────────────────────────────────────────
       10. INITIAL RENDER
    ───────────────────────────────────────────────────── */
    applyFilters();

});
