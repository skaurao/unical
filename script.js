
"use strict";

/* ==========================================
   UniCal 完全版 JavaScript
========================================== */

const $ = id => document.getElementById(id);
const pad = n => String(n).padStart(2, "0");

function dateKey(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function today() {
  return dateKey(new Date());
}

function parseDate(s) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function addDays(s, n) {
  const d = parseDate(s);
  d.setDate(d.getDate() + n);
  return dateKey(d);
}

function dateLabel(s) {
  const d = parseDate(s);
  return `${d.getMonth() + 1}月${d.getDate()}日（${"日月火水木金土"[d.getDay()]}）`;
}

function esc(v) {
  return String(v ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[c]);
}

function uid() {
  return "id" + Date.now().toString(36) +
    Math.random().toString(36).slice(2, 8);
}

const periodTimes = ["09:00", "10:45", "13:00", "14:45", "16:30"];
const weekNames = ["日", "月", "火", "水", "木", "金", "土"];

/* ==========================================
   サンプルデータ
========================================== */

function nextWeekday(day) {
  const d = new Date();
  d.setDate(d.getDate() + (day - d.getDay() + 7) % 7);
  return dateKey(d);
}

function initialData() {
  const users = [
    {
      id: "s001", password: "1234", role: "student",
      name: "みい", university: "サンプル大学",
      department: "社会情報学科", grade: "2",
      number: "S2026001", teacherPublic: true,
      friendPublic: true
    },
    {
      id: "s002", password: "1234", role: "student",
      name: "さくらこ", university: "サンプル大学",
      department: "社会情報学科", grade: "2",
      number: "S2026002", teacherPublic: false,
      friendPublic: true
    },
    {
      id: "s003", password: "1234", role: "student",
      name: "あおい", university: "サンプル大学",
      department: "情報学科", grade: "1",
      number: "S2026003", teacherPublic: true,
      friendPublic: true
    },
    {
      id: "t001", password: "1234", role: "teacher",
      name: "山田先生", university: "サンプル大学",
      department: "社会情報学部"
    },
    {
      id: "t002", password: "1234", role: "teacher",
      name: "佐藤先生", university: "サンプル大学",
      department: "情報学部"
    },
    {
      id: "t003", password: "1234", role: "teacher",
      name: "中村先生", university: "サンプル大学",
      department: "社会情報学部"
    }
  ];

  const subjects = [
    ["社会情報学基礎", 1, 1, "A棟203"],
    ["データサイエンス", 1, 2, "B棟301"],
    ["ゼミ", 2, 3, "C棟201"],
    ["統計学", 2, 1, "B棟202"],
    ["情報デザイン", 3, 2, "A棟102"],
    ["英語コミュニケーション", 3, 4, "D棟105"],
    ["社会調査法", 4, 1, "C棟301"],
    ["プログラミング", 4, 3, "PC教室"],
    ["メディア論", 5, 2, "A棟204"]
  ];

  const courses = subjects.map((c, i) => ({
    id: "c" + (i + 1),
    owner: "s001",
    title: c[0],
    day: c[1],
    period: c[2],
    room: c[3],
    totalClasses: 15,
    allowedAbsences: 4
  }));

  courses.push(
    {
      id: "c10", owner: "s002", title: "社会情報学基礎",
      day: 1, period: 1, room: "A棟203",
      totalClasses: 15, allowedAbsences: 4
    },
    {
      id: "c11", owner: "s003", title: "情報科学",
      day: 2, period: 2, room: "B棟101",
      totalClasses: 15, allowedAbsences: 4
    },
    {
      id: "c12", owner: "t001", title: "社会情報学基礎",
      day: 1, period: 1, room: "A棟203",
      totalClasses: 15, allowedAbsences: 4
    }
  );

  const attendance = {};

  subjects.forEach((c, i) => {
    for (let j = 0; j < 5; j++) {
      attendance[`c${i + 1}:history:${j}`] =
        i === 1 && j >= 2 ? "absent" : "attended";
    }
  });

  const base = today();

  const events = [
    {
      id: "e1", owner: "s001", type: "task",
      title: "プレゼン資料の提出",
      date: base, time: "18:00",
      note: "ゼミ", done: false
    },
    {
      id: "e2", owner: "s001", type: "task",
      title: "データ分析レポート",
      date: addDays(base, 1), time: "23:59",
      note: "PDF提出", done: false
    },
    {
      id: "e3", owner: "s001", type: "task",
      title: "社会調査法の課題",
      date: addDays(base, 7), time: "17:00",
      note: "", done: false
    },
    {
      id: "e4", owner: "s001", type: "private",
      title: "友達とカフェ",
      date: base, time: "17:30",
      note: "駅前", done: false
    },
    {
      id: "e5", owner: "s002", type: "private",
      title: "買い物",
      date: addDays(base, 2), time: "16:00",
      note: "", done: false
    }
  ];

  const slots = [
    ["t001", 1, "13:00", "13:30"],
    ["t001", 3, "15:00", "15:30"],
    ["t002", 2, "14:00", "14:30"],
    ["t003", 5, "10:00", "10:30"]
  ].map((s, i) => ({
    id: "slot" + i,
    teacherId: s[0],
    date: nextWeekday(s[1]),
    start: s[2],
    end: s[3]
  }));

  return {
    users, courses, attendance, events, slots,
    bookings: [], messages: [],
    friendships: [], friendRequests: []
  };
}

/* ==========================================
   データ保存
========================================== */

const STORAGE_KEY = "unical-v5-friend-requests";

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      if (data && Array.isArray(data.users)) {
        data.courses ||= [];
        data.events ||= [];
        data.attendance ||= {};
        data.slots ||= [];
        data.bookings ||= [];
        data.messages ||= [];
        data.friendships ||= [];
        data.friendRequests ||= [];
        return data;
      }
    }
  } catch (e) {
    console.warn("保存データの読み込みに失敗しました", e);
  }
  return initialData();
}

let db = loadData();

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (e) {
    console.warn("データ保存に失敗しました", e);
  }
}

/* ==========================================
   画面状態
========================================== */

let userId = null;
let page = "home";
let personId = null;
let personOrigin = "people";

let selectedDate = today();
let personDate = today();

let calendarMonth = new Date(
  new Date().getFullYear(), new Date().getMonth(), 1
);

let personMonth = new Date(
  new Date().getFullYear(), new Date().getMonth(), 1
);

let calendarFilter = "university";
let editingEvent = null;
let editingCourse = null;
let editingSlot = null;
let lastFriendSearch = "";

function me() {
  return db.users.find(u => u.id === userId);
}

function user(id) {
  return db.users.find(u => u.id === id);
}

function student() {
  return me()?.role === "student";
}

function teacher() {
  return me()?.role === "teacher";
}

function ownCourses() {
  return db.courses.filter(c => c.owner === userId);
}

function ownEvents() {
  return db.events.filter(e => e.owner === userId);
}

/* ==========================================
   ログイン・新規登録
========================================== */

function authMode(mode) {
  $("loginForm").hidden = mode !== "login";
  $("registerForm").hidden = mode !== "register";
  $("loginTab").classList.toggle("selected", mode === "login");
  $("registerTab").classList.toggle("selected", mode === "register");
  $("authError").textContent = "";
}

$("loginTab").onclick = () => authMode("login");
$("registerTab").onclick = () => authMode("register");

$("regRole").onchange = () => {
  $("registerStudentFields").hidden =
    $("regRole").value !== "student";
};

$("loginForm").onsubmit = e => {
  e.preventDefault();

  const id = $("loginId").value.trim();
  const password = $("loginPassword").value;

  const found = db.users.find(u =>
    u.id === id && u.password === password
  );

  if (!found) {
    $("authError").textContent =
      "IDまたはパスワードが違います";
    return;
  }

  login(found.id);
};

$("registerForm").onsubmit = e => {
  e.preventDefault();

  const id = $("regId").value.trim();
  const password = $("regPassword").value;
  const role = $("regRole").value;
  const name = $("regName").value.trim();
  const university = $("regUniversity").value.trim();
  const department = $("regDepartment").value.trim();
  const number = $("regNumber").value.trim();

  if (!id || !password || !name || !university || !department) {
    $("authError").textContent = "必須項目を入力してください";
    return;
  }

  if (password.length < 4) {
    $("authError").textContent =
      "パスワードは4文字以上にしてください";
    return;
  }

  if (db.users.some(u => u.id === id)) {
    $("authError").textContent =
      "このログインIDはすでに使われています";
    return;
  }

  if (role === "student") {
    if (!number) {
      $("authError").textContent = "学籍番号を入力してください";
      return;
    }

    if (db.users.some(u =>
      u.role === "student" &&
      u.number?.toLowerCase() === number.toLowerCase()
    )) {
      $("authError").textContent =
        "この学籍番号はすでに登録されています";
      return;
    }
  }

  const newUser = {
    id, password, role, name, university, department,
    grade: role === "student" ? $("regGrade").value : "",
    number: role === "student" ? number : "",
    teacherPublic: false,
    friendPublic: false
  };

  db.users.push(newUser);
  save();
  $("registerForm").reset();
  login(newUser.id);
};

function login(id) {
  if (!user(id)) return;

  userId = id;
  page = "home";
  personId = null;
  lastFriendSearch = "";

  $("authScreen").hidden = true;
  $("appScreen").hidden = false;

  render();
}

$("logoutBtn").onclick = () => {
  userId = null;
  $("appScreen").hidden = true;
  $("authScreen").hidden = false;
  $("loginPassword").value = "";
  authMode("login");
};

/* ==========================================
   ページ切り替え
========================================== */

function goPage(name) {
  page = name;
  render();
  window.scrollTo(0, 0);
}

document.querySelectorAll("[data-page]").forEach(button => {
  button.onclick = () => goPage(button.dataset.page);
});

$("backPersonBtn").onclick = () => goPage(personOrigin);

function render() {
  if (!me()) return;

  $("headerName").textContent =
    `${me().name} ・ ${student() ? "学生" : "先生"}`;

  $("peopleNavText").textContent =
    student() ? "先生・友達" : "生徒";

  $("peopleTitle").textContent =
    student() ? "先生・友達" : "生徒";

  $("studentFriendsArea").hidden = !student();
  $("studentMenu").hidden = !student();
  $("teacherSlotArea").hidden = !teacher();

  ["home", "calendar", "timetable", "people", "person", "menu"]
    .forEach(name => {
      $(name + "Page").hidden = page !== name;
    });

  document.querySelectorAll("[data-page]").forEach(button => {
    const current = page === "person" ? personOrigin : page;
    button.classList.toggle(
      "active", button.dataset.page === current
    );
  });

  renderHome();
  renderCalendar();
  renderTimetable();
  renderPeople();
  renderMenu();
  renderTeacherManagement();

  if (page === "person") {
    renderPerson();
  }

  renderBadges();
}

/* ==========================================
   授業・予定
========================================== */

function lessonsOn(date, owner = userId) {
  const day = parseDate(date).getDay();

  return db.courses
    .filter(c => c.owner === owner && c.day === day)
    .map(c => ({
      id: `lesson:${c.id}:${date}`,
      courseId: c.id,
      owner,
      type: "university",
      title: c.title,
      date,
      time: periodTimes[c.period - 1],
      note: c.room,
      lesson: true
    }));
}

function eventsOn(date, owner = userId, filter = "all") {
  let items = [
    ...lessonsOn(date, owner),
    ...db.events.filter(e =>
      e.owner === owner && e.date === date
    )
  ];

  if (filter === "university") {
    items = items.filter(e => e.type !== "private");
  }

  if (filter === "private") {
    items = items.filter(e => e.type === "private");
  }

  return items.sort((a, b) =>
    (a.time || "").localeCompare(b.time || "")
  );
}

function eventHTML(e, readonly = false) {
  const labels = {
    university: "大学",
    task: "課題",
    private: "プライベート"
  };

  let control = "";

  if (!readonly && e.lesson) {
    const key = `${e.courseId}:${e.date}`;
    const value = db.attendance[key] || "unset";

    const text =
      value === "attended" ? "✓ 出席" :
      value === "absent" ? "× 欠席" : "○ 未設定";

    control = `
      <button class="tiny" data-attendance="${esc(key)}">
        ${text}
      </button>
    `;
  } else if (!readonly && e.type === "task") {
    control = `
      <button class="tiny" data-task="${esc(e.id)}">
        ${e.done ? "完了" : "未完了"}
      </button>
    `;
  }

  return `
    <div class="item ${esc(e.type)}">
      <div class="item-top">
        <button class="plain"
          ${readonly ? "disabled" : ""}
          data-edit-event="${esc(e.id)}">

          <span class="tag ${esc(e.type)}">
            ${labels[e.type] || "予定"}
          </span>

          <strong>${esc(e.title)}</strong>
          <small>
            ${esc(e.time)}
            ${e.note ? " ・ " + esc(e.note) : ""}
          </small>
        </button>
        ${control}
      </div>
    </div>
  `;
}

function showEvents(id, items, readonly = false) {
  const root = $(id);

  root.innerHTML = items.length
    ? items.map(e => eventHTML(e, readonly)).join("")
    : '<p class="empty">予定はありません</p>';

  if (readonly) return;

  root.querySelectorAll("[data-edit-event]").forEach(button => {
    button.onclick = () => {
      const id = button.dataset.editEvent;

      if (id.startsWith("lesson:")) {
        openCourse(id.split(":")[1]);
      } else {
        openEvent(id);
      }
    };
  });

  root.querySelectorAll("[data-attendance]").forEach(button => {
    button.onclick = () => {
      const key = button.dataset.attendance;
      const old = db.attendance[key] || "unset";

      db.attendance[key] =
        old === "unset" ? "attended" :
        old === "attended" ? "absent" : "unset";

      save();
      render();
    };
  });

  root.querySelectorAll("[data-task]").forEach(button => {
    button.onclick = () => {
      const e = db.events.find(x =>
        x.id === button.dataset.task &&
        x.owner === userId
      );

      if (!e) return;

      e.done = !e.done;
      save();
      render();
    };
  });
}

/* ==========================================
   ホーム
========================================== */

function renderHome() {
  $("homeTitle").textContent = `${me().name}さん、こんにちは`;
  $("homeDate").textContent = dateLabel(today());

  showEvents("todayEvents", eventsOn(today()));

  const tasks = ownEvents()
    .filter(e => e.type === "task")
    .sort((a, b) => a.date.localeCompare(b.date));

  $("homeTodos").innerHTML = tasks.length
    ? tasks.map(e => {
        const days = Math.round(
          (parseDate(e.date) - parseDate(today())) / 86400000
        );

        const urgent = !e.done && days <= 3;

        const warning =
          days < 0 ? "締切を過ぎています" :
          days === 0 ? "今日が締切！" :
          `あと${days}日`;

        return `
          <div class="item task
            ${urgent ? "urgent" : ""}
            ${e.done ? "done" : ""}">

            <div class="item-top">
              <div>
                <strong>${esc(e.title)}</strong>
                <small>
                  締切：${dateLabel(e.date)} ${esc(e.time)}
                </small>
                ${urgent
                  ? `<p class="deadline">⚠ ${warning}</p>`
                  : ""}
              </div>

              <input type="checkbox"
                data-todo="${e.id}"
                ${e.done ? "checked" : ""}>
            </div>
          </div>
        `;
      }).join("")
    : '<p class="empty">ToDoはありません</p>';

  $("homeTodos").querySelectorAll("[data-todo]")
    .forEach(button => {
      button.onchange = () => {
        const e = db.events.find(x =>
          x.id === button.dataset.todo &&
          x.owner === userId
        );

        if (!e) return;

        e.done = button.checked;
        save();
        render();
      };
    });
}

$("addTodayBtn").onclick = () => openEvent(null, today());

/* ==========================================
   カレンダー
========================================== */

function monthHTML(month, chosen, itemsForDate) {
  const y = month.getFullYear();
  const m = month.getMonth();

  const offset = new Date(y, m, 1).getDay();
  const last = new Date(y, m + 1, 0).getDate();
  const count = Math.ceil((offset + last) / 7) * 7;

  let html = "";

  for (let i = 0; i < count; i++) {
    const d = new Date(y, m, i - offset + 1);
    const key = dateKey(d);
    const items = itemsForDate(key);

    html += `
      <button class="day
        ${d.getMonth() !== m ? "other" : ""}
        ${d.getDay() === 0 ? "sun" : ""}
        ${d.getDay() === 6 ? "sat" : ""}
        ${key === today() ? "today" : ""}
        ${key === chosen ? "chosen" : ""}"
        data-day="${key}">

        ${d.getDate()}

        <span class="dots">
          ${items.slice(0, 3).map(e => `
            <i class="dot
              ${e.type === "private" ? "private" :
                e.type === "task" ? "task" : ""}">
            </i>
          `).join("")}
        </span>
      </button>
    `;
  }

  return html;
}

function renderCalendar() {
  $("monthLabel").textContent =
    `${calendarMonth.getFullYear()}年${calendarMonth.getMonth() + 1}月`;

  document.querySelectorAll("[data-filter]").forEach(button => {
    button.classList.toggle(
      "selected",
      button.dataset.filter === calendarFilter
    );
  });

  $("calendarGrid").innerHTML = monthHTML(
    calendarMonth,
    selectedDate,
    d => eventsOn(d, userId, calendarFilter)
  );

  $("calendarGrid").querySelectorAll("[data-day]")
    .forEach(button => {
      button.onclick = () => {
        selectedDate = button.dataset.day;
        const d = parseDate(selectedDate);
        calendarMonth = new Date(d.getFullYear(), d.getMonth(), 1);
        render();
      };
    });

  $("selectedDateTitle").textContent =
    dateLabel(selectedDate) + "の予定";

  showEvents(
    "selectedEvents",
    eventsOn(selectedDate, userId, calendarFilter)
  );
}

function moveMonth(n) {
  calendarMonth = new Date(
    calendarMonth.getFullYear(),
    calendarMonth.getMonth() + n, 1
  );
  selectedDate = dateKey(calendarMonth);
  render();
}

$("prevMonth").onclick = () => moveMonth(-1);
$("nextMonth").onclick = () => moveMonth(1);

$("todayBtn").onclick = () => {
  selectedDate = today();
  const d = new Date();
  calendarMonth = new Date(d.getFullYear(), d.getMonth(), 1);
  render();
};

document.querySelectorAll("[data-filter]").forEach(button => {
  button.onclick = () => {
    calendarFilter = button.dataset.filter;
    render();
  };
});

$("addSelectedBtn").onclick = () => openEvent(null, selectedDate);

/* ==========================================
   予定追加・編集
========================================== */

function openEvent(id = null, date = selectedDate) {
  editingEvent = id;

  const e = db.events.find(x =>
    x.id === id && x.owner === userId
  );

  $("eventType").value = e?.type || "university";
  $("eventTitle").value = e?.title || "";
  $("eventDate").value = e?.date || date;
  $("eventTime").value = e?.time || "12:00";
  $("eventNote").value = e?.note || "";
  $("deleteEvent").hidden = !e;

  $("eventDialog").showModal();
}

$("cancelEvent").onclick = () => $("eventDialog").close();

$("eventForm").onsubmit = e => {
  e.preventDefault();

  const old = db.events.find(x =>
    x.id === editingEvent && x.owner === userId
  );

  const data = {
    id: old?.id || uid(),
    owner: userId,
    type: $("eventType").value,
    title: $("eventTitle").value.trim(),
    date: $("eventDate").value,
    time: $("eventTime").value,
    note: $("eventNote").value.trim(),
    done: old?.done || false
  };

  if (old) Object.assign(old, data);
  else db.events.push(data);

  selectedDate = data.date;
  const d = parseDate(data.date);
  calendarMonth = new Date(d.getFullYear(), d.getMonth(), 1);

  save();
  $("eventDialog").close();
  render();
};

$("deleteEvent").onclick = () => {
  if (!confirm("この予定を削除しますか？")) return;

  db.events = db.events.filter(e => !(
    e.id === editingEvent && e.owner === userId
  ));

  save();
  $("eventDialog").close();
  render();
};

/* ==========================================
   出席・欠席管理
========================================== */

function attendanceStats(course) {
  const total = Number(course.totalClasses ?? 15);
  const allowed = Number(course.allowedAbsences ?? 4);

  const records = Object.entries(db.attendance)
    .filter(([key, value]) =>
      key.startsWith(course.id + ":") &&
      ["attended", "absent"].includes(value)
    );

  const attended = records.filter(
    ([key, value]) => value === "attended"
  ).length;

  const absent = records.filter(
    ([key, value]) => value === "absent"
  ).length;

  const attendanceRate = total > 0
    ? attended / total * 100 : 0;

  const absenceRate = allowed > 0
    ? absent / allowed * 100
    : absent > 0 ? 100 : 0;

  return {
    total, allowed, attended, absent,
    attendanceRate, absenceRate,
    remaining: Math.max(0, total - attended - absent),
    remainingAbsences: Math.max(0, allowed - absent),
    exceeded: absent > allowed,
    reachedLimit: absent === allowed,
    overRecorded: attended + absent > total
  };
}

function percent(n) {
  return n.toFixed(1) + "%";
}

function attendanceCard(course) {
  const s = attendanceStats(course);

  let warning = "";

  if (s.exceeded) {
    warning = `<div class="attendance-warning">
      ⚠ 欠席可能回数を超えています！
    </div>`;
  } else if (s.reachedLimit) {
    warning = `<div class="attendance-warning">
      ⚠ 欠席可能回数に達しています。
    </div>`;
  } else {
    warning = `<div class="attendance-safe">
      あと${s.remainingAbsences}回まで欠席できます。
    </div>`;
  }

  if (s.overRecorded) {
    warning += `<div class="attendance-warning">
      ⚠ 出席・欠席の記録が総授業回数を超えています。
    </div>`;
  }

  return `
    <div class="attendance-card ${s.exceeded ? "warning" : ""}">
      <h3>${esc(course.title)}</h3>

      <p class="muted">
        総授業回数：${s.total}回
        <br>
        欠席可能回数：${s.allowed}回
      </p>

      <div class="attendance-info">
        <div class="attendance-stat present">
          <small>現在の出席</small>
          <strong>${s.attended} / ${s.total}回</strong>
          <span>${percent(s.attendanceRate)}</span>
        </div>

        <div class="attendance-stat absent">
          <small>現在の欠席</small>
          <strong>${s.absent} / ${s.allowed}回</strong>
          <span>${percent(s.absenceRate)}</span>
        </div>
      </div>

      <div class="attendance-progress">
        <div style="width:${Math.min(100, s.attendanceRate)}%"></div>
      </div>

      <p class="muted">未実施・未記録：${s.remaining}回</p>
      ${warning}

      <button class="outline wide"
        data-edit-attendance="${course.id}">
        授業詳細・出席条件を編集
      </button>
    </div>
  `;
}

/* ==========================================
   時間割
========================================== */

function renderTimetable() {
  let html = '<div class="tt-label"></div>';

  for (let d = 1; d <= 5; d++) {
    html += `<div class="tt-label">${weekNames[d]}</div>`;
  }

  for (let p = 1; p <= 5; p++) {
    html += `<div class="tt-label">${p}限</div>`;

    for (let d = 1; d <= 5; d++) {
      const c = ownCourses().find(x =>
        x.day === d && x.period === p
      );

      html += c
        ? `<button class="tt-cell filled" data-course="${c.id}">
            <strong>${esc(c.title)}</strong>
            <small>${esc(c.room)}</small>
          </button>`
        : `<button class="tt-cell" data-empty="${d}:${p}">＋</button>`;
    }
  }

  $("timetableGrid").innerHTML = html;

  $("timetableGrid").querySelectorAll("[data-course]")
    .forEach(button => {
      button.onclick = () => openCourse(button.dataset.course);
    });

  $("timetableGrid").querySelectorAll("[data-empty]")
    .forEach(button => {
      const [day, period] =
        button.dataset.empty.split(":").map(Number);
      button.onclick = () => openCourse(null, day, period);
    });

  const courses = ownCourses();

  $("attendanceList").innerHTML = courses.length
    ? courses.map(attendanceCard).join("")
    : '<p class="empty">授業はありません</p>';

  $("attendanceList")
    .querySelectorAll("[data-edit-attendance]")
    .forEach(button => {
      button.onclick = () => openCourse(button.dataset.editAttendance);
    });
}

/* ==========================================
   授業詳細・編集
========================================== */

function openCourse(id = null, day = 1, period = 1) {
  editingCourse = id;

  const c = db.courses.find(x =>
    x.id === id && x.owner === userId
  );

  $("courseTitle").value = c?.title || "";
  $("courseDay").value = c?.day || day;
  $("coursePeriod").value = c?.period || period;
  $("courseRoom").value = c?.room || "";
  $("courseTotalClasses").value = c?.totalClasses ?? 15;
  $("courseAllowedAbsences").value = c?.allowedAbsences ?? 4;
  $("deleteCourse").hidden = !c;

  if (c) {
    const s = attendanceStats(c);

    $("courseAttendancePreview").innerHTML = `
      <div class="card">
        <h3>現在の出席状況</h3>
        <p>出席：${s.attended}/${s.total}回
          （${percent(s.attendanceRate)}）</p>
        <p>欠席：${s.absent}/${s.allowed}回
          （${percent(s.absenceRate)}）</p>
        <p class="muted">
          あと${s.remainingAbsences}回まで欠席できます。
        </p>
      </div>
    `;
  } else {
    $("courseAttendancePreview").innerHTML = "";
  }

  $("courseDialog").showModal();
}

$("cancelCourse").onclick = () => $("courseDialog").close();

$("courseForm").onsubmit = e => {
  e.preventDefault();

  const day = Number($("courseDay").value);
  const period = Number($("coursePeriod").value);
  const total = Number($("courseTotalClasses").value);
  const allowed = Number($("courseAllowedAbsences").value);

  if (!Number.isInteger(total) || total < 1) {
    alert("総授業回数は1回以上にしてください");
    return;
  }

  if (!Number.isInteger(allowed) ||
      allowed < 0 || allowed > total) {
    alert("欠席可能回数は0回以上、総授業回数以下にしてください");
    return;
  }

  if (ownCourses().some(c =>
    c.day === day &&
    c.period === period &&
    c.id !== editingCourse
  )) {
    alert("その曜日・時限には授業があります");
    return;
  }

  const old = db.courses.find(c =>
    c.id === editingCourse && c.owner === userId
  );

  const data = {
    id: old?.id || uid(),
    owner: userId,
    title: $("courseTitle").value.trim(),
    day, period,
    room: $("courseRoom").value.trim(),
    totalClasses: total,
    allowedAbsences: allowed
  };

  if (old) Object.assign(old, data);
  else db.courses.push(data);

  save();
  $("courseDialog").close();
  render();
};

$("deleteCourse").onclick = () => {
  if (!confirm("授業を削除しますか？")) return;

  db.courses = db.courses.filter(c => !(
    c.id === editingCourse && c.owner === userId
  ));

  save();
  $("courseDialog").close();
  render();
};

/* ==========================================
   友達申請・承認・解除
========================================== */

function friendship(a, b) {
  return db.friendships.find(f =>
    (f.a === a && f.b === b) ||
    (f.a === b && f.b === a)
  );
}

function areFriends(a, b) {
  return !!friendship(a, b);
}

function pendingRequest(a, b) {
  return db.friendRequests.find(r =>
    r.status === "pending" &&
    ((r.from === a && r.to === b) ||
     (r.from === b && r.to === a))
  );
}

function incomingRequests() {
  return db.friendRequests.filter(r =>
    r.to === userId && r.status === "pending"
  );
}

function outgoingRequests() {
  return db.friendRequests.filter(r =>
    r.from === userId && r.status === "pending"
  );
}

function friends() {
  return db.users.filter(u =>
    u.role === "student" &&
    u.id !== userId &&
    areFriends(userId, u.id)
  );
}

function sendFriendRequest(id) {
  if (!student() || id === userId) return;
  if (areFriends(userId, id) || pendingRequest(userId, id)) return;

  db.friendRequests.push({
    id: uid(), from: userId, to: id, status: "pending"
  });

  lastFriendSearch = "";
  $("friendSearch").value = "";

  save();
  render();
}

function acceptFriendRequest(id) {
  const r = db.friendRequests.find(x =>
    x.id === id && x.to === userId && x.status === "pending"
  );

  if (!r) return;

  if (!areFriends(r.from, r.to)) {
    db.friendships.push({
      id: uid(), a: r.from, b: r.to
    });
  }

  r.status = "accepted";
  save();
  render();
}

function rejectFriendRequest(id) {
  const r = db.friendRequests.find(x =>
    x.id === id && x.to === userId && x.status === "pending"
  );

  if (!r) return;

  r.status = "rejected";
  save();
  render();
}

function cancelFriendRequest(id) {
  const r = db.friendRequests.find(x =>
    x.id === id && x.from === userId && x.status === "pending"
  );

  if (!r) return;

  r.status = "cancelled";
  save();
  render();
}

function removeFriend(id) {
  if (!areFriends(userId, id)) return;

  if (!confirm(`${user(id)?.name}さんとの友達関係を解除しますか？`)) {
    return;
  }

  db.friendships = db.friendships.filter(f => !(
    (f.a === userId && f.b === id) ||
    (f.a === id && f.b === userId)
  ));

  save();
  render();
}

/* ==========================================
   メッセージ・通知
========================================== */

function messagesBetween(a, b) {
  return db.messages.filter(m =>
    (m.from === a && m.to === b) ||
    (m.from === b && m.to === a)
  ).sort((x, y) => x.createdAt.localeCompare(y.createdAt));
}

function unreadFrom(id) {
  return db.messages.filter(m =>
    m.from === id && m.to === userId && !m.read
  ).length;
}

function latestMessage(id) {
  const list = messagesBetween(userId, id);
  return list[list.length - 1] || null;
}

function sortedPeople(list) {
  return [...list].sort((a, b) => {
    const unread = unreadFrom(b.id) - unreadFrom(a.id);
    if (unread) return unread;

    return (latestMessage(b.id)?.createdAt || "")
      .localeCompare(latestMessage(a.id)?.createdAt || "");
  });
}

function markRead(id) {
  let changed = false;

  db.messages.forEach(m => {
    if (m.from === id && m.to === userId && !m.read) {
      m.read = true;
      changed = true;
    }
  });

  if (changed) save();
}

function renderBadges() {
  const peopleCount = db.messages.filter(m =>
    m.to === userId && !m.read &&
    (teacher() || user(m.from)?.role === "teacher" ||
      (student() && areFriends(userId, m.from)))
  ).length;

  const requestCount = student() ? incomingRequests().length : 0;

  $("peopleBadge").hidden = peopleCount + requestCount === 0;
  $("peopleBadge").textContent = peopleCount + requestCount;

  // 友達機能はメニュー画面ではなく先生・友達画面にある
  $("menuBadge").hidden = true;
}

/* ==========================================
   コンパクトな人物一覧
========================================== */

function compactRow(p, mode, requestId = "") {
  if (!p) return "";

  const unread = unreadFrom(p.id);
  const latest = latestMessage(p.id);
  const canOpen = mode === "friend" || mode === "person";

  let buttons = "";

  if (mode === "search") {
    buttons = `
      <button class="icon-action"
        data-send-friend="${p.id}" title="友達申請">＋</button>
    `;
  }

  if (mode === "friend") {
    buttons = `
      <button class="icon-action remove"
        data-remove-friend="${p.id}" title="友達解除">✓</button>
    `;
  }

  if (mode === "incoming") {
    buttons = `
      <button class="icon-action"
        data-accept="${requestId}">✓</button>
      <button class="icon-action reject"
        data-reject="${requestId}">×</button>
    `;
  }

  if (mode === "outgoing") {
    buttons = `
      <button class="icon-action reject"
        data-cancel-request="${requestId}">×</button>
    `;
  }

  if (mode === "person") {
    buttons = `
      <button class="icon-action"
        data-open-person="${p.id}">›</button>
    `;
  }

  return `
    <div class="friend-row
      ${canOpen ? "clickable" : ""}
      ${unread && canOpen ? "unread" : ""}"
      ${canOpen ? `data-open-row="${p.id}"` : ""}>

      <div class="friend-info">
        <strong class="friend-name">${esc(p.name)}</strong>

        ${unread && canOpen
          ? `<span class="count">${unread}</span>` : ""}

        <span class="friend-meta">
          ${esc(p.department)}
          ${p.role === "student" ? esc(p.grade) + "年" : ""}
          ${mode === "outgoing" ? " ・ 申請待ち" : ""}
        </span>

        ${unread && canOpen
          ? `<span class="friend-preview">
               ✉ ${unread}件の新着メッセージ
               ${latest ? "：" + esc(latest.text.slice(0, 20)) : ""}
             </span>` : ""}
      </div>

      <div class="friend-actions">${buttons}</div>
    </div>
  `;
}

function bindRows(root) {
  // 名前以外の場所を押しても詳細を開く
  root.querySelectorAll("[data-open-row]").forEach(row => {
    row.onclick = e => {
      if (e.target.closest(".friend-actions")) return;
      openPerson(row.dataset.openRow);
    };
  });

  root.querySelectorAll("[data-send-friend]").forEach(b => {
    b.onclick = () => sendFriendRequest(b.dataset.sendFriend);
  });

  root.querySelectorAll("[data-accept]").forEach(b => {
    b.onclick = () => acceptFriendRequest(b.dataset.accept);
  });

  root.querySelectorAll("[data-reject]").forEach(b => {
    b.onclick = () => rejectFriendRequest(b.dataset.reject);
  });

  root.querySelectorAll("[data-cancel-request]").forEach(b => {
    b.onclick = () => cancelFriendRequest(b.dataset.cancelRequest);
  });

  root.querySelectorAll("[data-remove-friend]").forEach(b => {
    b.onclick = () => removeFriend(b.dataset.removeFriend);
  });

  root.querySelectorAll("[data-open-person]").forEach(b => {
    b.onclick = e => {
      e.stopPropagation();
      openPerson(b.dataset.openPerson);
    };
  });
}

/* ==========================================
   先生・友達 / 生徒画面
========================================== */

function renderPeople() {
  $("peopleTitle").textContent =
    student() ? "先生・友達" : "生徒";

  $("peopleListTitle").textContent =
    student() ? "先生一覧" : "生徒一覧";

  $("peopleDescription").textContent =
    student()
      ? "先生の面談予約や、友達との予定共有・メッセージができます。"
      : "生徒の予定確認やメッセージができます。";

  $("studentFriendsArea").hidden = !student();

  if (student()) {
    $("peopleFilters").innerHTML = "";

    const list = sortedPeople(
      db.users.filter(u => u.role === "teacher")
    );

    $("peopleList").innerHTML =
      list.map(p => compactRow(p, "person")).join("");

    bindRows($("peopleList"));
    renderFriends();
    return;
  }

  const departments = [...new Set(
    db.users
      .filter(u => u.role === "student")
      .map(u => u.department)
  )];

  $("peopleFilters").innerHTML = `
    <div class="card">
      <select id="studentDepartment" class="filter-input">
        <option value="">すべての学科</option>
        ${departments.map(d =>
          `<option value="${esc(d)}">${esc(d)}</option>`
        ).join("")}
      </select>

      <select id="studentGrade" class="filter-input">
        <option value="">すべての学年</option>
        ${[1, 2, 3, 4].map(n =>
          `<option value="${n}">${n}年</option>`
        ).join("")}
      </select>

      <input id="studentQuery" class="filter-input"
        placeholder="名前・学籍番号で検索">
    </div>
  `;

  $("studentDepartment").onchange = renderStudentResults;
  $("studentGrade").onchange = renderStudentResults;
  $("studentQuery").oninput = renderStudentResults;

  renderStudentResults();
}

function renderStudentResults() {
  const dep = $("studentDepartment").value;
  const grade = $("studentGrade").value;
  const q = $("studentQuery").value.trim().toLowerCase();

  const list = sortedPeople(db.users.filter(u =>
    u.role === "student" &&
    (!dep || u.department === dep) &&
    (!grade || u.grade === grade) &&
    (!q || u.name.toLowerCase().includes(q) ||
      u.number?.toLowerCase().includes(q))
  ));

  $("peopleList").innerHTML = list.length
    ? list.map(p => compactRow(p, "person")).join("")
    : '<p class="empty">該当する生徒はいません</p>';

  bindRows($("peopleList"));
}

/* ==========================================
   友達機能（学生のみ）
========================================== */

function renderFriends() {
  if (!student()) return;

  const incoming = incomingRequests();
  const outgoing = outgoingRequests();

  $("requestCount").hidden = incoming.length === 0;
  $("requestCount").textContent = incoming.length;

  $("friendRequests").innerHTML = incoming.length
    ? incoming.map(r =>
        compactRow(user(r.from), "incoming", r.id)
      ).join("")
    : '<p class="empty">届いている申請はありません</p>';

  $("pendingFriends").innerHTML = outgoing.length
    ? outgoing.map(r =>
        compactRow(user(r.to), "outgoing", r.id)
      ).join("")
    : '<p class="empty">申請中の友達はいません</p>';

  const list = sortedPeople(friends());

  $("friendList").innerHTML = list.length
    ? list.map(p => compactRow(p, "friend")).join("")
    : '<p class="empty">まだ友達がいません</p>';

  bindRows($("friendRequests"));
  bindRows($("pendingFriends"));
  bindRows($("friendList"));

  if (lastFriendSearch) {
    showFriendSearch(lastFriendSearch);
  } else {
    $("friendSearchResult").innerHTML = "";
  }
}

function showFriendSearch(number) {
  const p = db.users.find(u =>
    u.role === "student" &&
    u.id !== userId &&
    u.number?.toLowerCase() === number.toLowerCase()
  );

  if (!p) {
    $("friendSearchResult").innerHTML =
      '<p class="empty">該当する生徒はいません</p>';
    return;
  }

  if (areFriends(userId, p.id) ||
      pendingRequest(userId, p.id)) {
    $("friendSearchResult").innerHTML =
      '<p class="empty">友達または申請中の相手です</p>';
    return;
  }

  $("friendSearchResult").innerHTML = compactRow(p, "search");
  bindRows($("friendSearchResult"));
}

function searchFriend() {
  if (!student()) return;

  lastFriendSearch = $("friendSearch").value.trim();

  if (!lastFriendSearch) {
    $("friendSearchResult").innerHTML = "";
    return;
  }

  showFriendSearch(lastFriendSearch);
}

$("friendSearchBtn").onclick = searchFriend;

$("friendSearch").onkeydown = e => {
  if (e.key === "Enter") {
    e.preventDefault();
    searchFriend();
  }
};

/* ==========================================
   メニュー
========================================== */

function renderMenu() {
  $("profileName").textContent = me().name;

  $("profileInfo").textContent =
    `${me().university} ・ ${me().department}` +
    (student() ? ` ${me().grade}年` : "");

  $("studentMenu").hidden = !student();

  if (student()) {
    $("teacherPublic").checked = !!me().teacherPublic;
    $("friendPublic").checked = !!me().friendPublic;
  }
}

$("teacherPublic").onchange = e => {
  if (!student()) return;
  me().teacherPublic = e.target.checked;
  save();
};

$("friendPublic").onchange = e => {
  if (!student()) return;
  me().friendPublic = e.target.checked;
  save();
};

$("resetBtn").onclick = () => {
  if (!confirm("デモデータを初期化しますか？")) return;

  db = initialData();
  save();

  userId = null;
  $("appScreen").hidden = true;
  $("authScreen").hidden = false;
  authMode("login");
};

/* ==========================================
   相手の詳細画面
========================================== */

function openPerson(id) {
  const p = user(id);
  if (!p || p.id === userId) return;

  const allowed = teacher()
    ? p.role === "student"
    : p.role === "teacher" ||
      (p.role === "student" && areFriends(userId, p.id));

  if (!allowed) return;

  personId = id;
  personOrigin = "people";
  personDate = today();

  const d = new Date();
  personMonth = new Date(d.getFullYear(), d.getMonth(), 1);

  markRead(id);
  goPage("person");
}

function personCalendarHTML(marked) {
  return `
    <div class="schedule-card">
      <div class="calendar-header">
        <button data-person-month="-1">‹</button>
        <strong>
          ${personMonth.getFullYear()}年
          ${personMonth.getMonth() + 1}月
        </strong>
        <button data-person-month="1">›</button>
      </div>

      <div class="week-head">
        <span>日</span><span>月</span><span>火</span>
        <span>水</span><span>木</span><span>金</span><span>土</span>
      </div>

      <div class="calendar-grid">
        ${monthHTML(personMonth, personDate, d =>
          marked.includes(d) ? [{ type: "university" }] : []
        )}
      </div>
    </div>
  `;
}

function bindPersonCalendar() {
  $("personSchedule")
    .querySelectorAll("[data-person-month]")
    .forEach(button => {
      button.onclick = () => {
        personMonth = new Date(
          personMonth.getFullYear(),
          personMonth.getMonth() +
            Number(button.dataset.personMonth),
          1
        );
        personDate = dateKey(personMonth);
        renderPerson();
      };
    });

  $("personSchedule")
    .querySelectorAll("[data-day]")
    .forEach(button => {
      button.onclick = () => {
        personDate = button.dataset.day;
        const d = parseDate(personDate);
        personMonth = new Date(d.getFullYear(), d.getMonth(), 1);
        renderPerson();
      };
    });
}

function renderPerson() {
  if (!personId) return;

  const p = user(personId);
  if (!p) return;

  $("personTitle").textContent = p.name;
  $("personDescription").textContent =
    `${p.university} ・ ${p.department}`;

  if (p.role === "teacher") {
    renderTeacherSchedule(p);
  } else {
    renderStudentSchedule(p);
  }

  renderMessages();
}

/* ==========================================
   先生の空き時間・面談予約
========================================== */

function activeBooking(slotId) {
  return db.bookings.find(b =>
    b.slotId === slotId &&
    ["pending", "approved"].includes(b.status)
  );
}

function bookingText(status) {
  return {
    pending: "承認待ち",
    approved: "承認済み",
    rejected: "お断り",
    cancelled: "キャンセル"
  }[status] || status;
}

function renderTeacherSchedule(p) {
  const slots = db.slots.filter(s => s.teacherId === p.id);
  const marked = [...new Set(slots.map(s => s.date))];

  let html = personCalendarHTML(marked);

  const daySlots = slots
    .filter(s => s.date === personDate)
    .sort((a, b) => a.start.localeCompare(b.start));

  html += `
    <div class="section-title">
      <h2>${dateLabel(personDate)}の空き時間</h2>
    </div>
  `;

  html += daySlots.length
    ? `<div class="schedule-card">
        ${daySlots.map(s => `
          <div class="schedule-row">
            <strong>${esc(s.start)}〜${esc(s.end)}</strong>
            <button class="primary"
              data-book="${s.id}"
              ${activeBooking(s.id) || s.date < today()
                ? "disabled" : ""}>
              ${activeBooking(s.id) ? "予約済み" : "予約する"}
            </button>
          </div>
        `).join("")}
      </div>`
    : '<p class="empty">空き時間はありません</p>';

  const bookings = db.bookings.filter(b =>
    b.teacherId === p.id && b.studentId === userId
  );

  html += `<div class="section-title"><h2>面談予約</h2></div>`;

  html += bookings.length
    ? bookings.map(b => {
        const slot = db.slots.find(s => s.id === b.slotId);
        return `
          <div class="card">
            <strong>
              ${dateLabel(b.date)}
              ${slot ? esc(slot.start) : ""}
            </strong>
            <p class="status">${bookingText(b.status)}</p>
            ${["pending", "approved"].includes(b.status)
              ? `<button class="outline"
                   data-cancel-booking="${b.id}">
                   取り消す
                 </button>` : ""}
          </div>
        `;
      }).join("")
    : '<p class="empty">予約はありません</p>';

  $("personSchedule").innerHTML = html;
  $("personManagement").innerHTML = "";

  bindPersonCalendar();

  $("personSchedule").querySelectorAll("[data-book]")
    .forEach(button => {
      button.onclick = () => bookSlot(button.dataset.book);
    });

  $("personSchedule")
    .querySelectorAll("[data-cancel-booking]")
    .forEach(button => {
      button.onclick = () =>
        cancelBooking(button.dataset.cancelBooking);
    });
}

function bookSlot(id) {
  if (!student()) return;

  const s = db.slots.find(x =>
    x.id === id && x.teacherId === personId
  );

  if (!s || activeBooking(id) || s.date < today()) return;

  db.bookings.push({
    id: uid(),
    slotId: id,
    date: s.date,
    teacherId: s.teacherId,
    studentId: userId,
    status: "pending"
  });

  save();
  render();
  alert("面談を申し込みました");
}

function cancelBooking(id) {
  const b = db.bookings.find(x =>
    x.id === id && x.studentId === userId &&
    ["pending", "approved"].includes(x.status)
  );

  if (!b) return;

  b.status = "cancelled";
  save();
  render();
}

/* ==========================================
   生徒の予定表示
========================================== */

function renderStudentSchedule(p) {
  const canSee = student()
    ? areFriends(userId, p.id) && p.friendPublic
    : p.teacherPublic;

  let html = "";

  if (!canSee) {
    html = `
      <div class="card">
        <h2>予定カレンダー</h2>
        <p class="muted">この生徒の予定は非公開です。</p>
      </div>
    `;
  } else {
    const marked = [];
    const y = personMonth.getFullYear();
    const m = personMonth.getMonth();
    const last = new Date(y, m + 1, 0).getDate();

    for (let d = 1; d <= last; d++) {
      const key = dateKey(new Date(y, m, d));
      const list = student()
        ? eventsOn(key, p.id)
        : eventsOn(key, p.id, "university");

      if (list.length) marked.push(key);
    }

    html = personCalendarHTML(marked);

    html += `
      <div class="section-title">
        <h2>${dateLabel(personDate)}の予定</h2>
      </div>
    `;

    const list = student()
      ? eventsOn(personDate, p.id)
      : eventsOn(personDate, p.id, "university");

    html += list.length
      ? list.map(e => eventHTML(e, true)).join("")
      : '<p class="empty">予定はありません</p>';
  }

  $("personSchedule").innerHTML = html;
  $("personManagement").innerHTML = "";

  if (canSee) bindPersonCalendar();
}

/* ==========================================
   先生の空き時間管理・予約承認
========================================== */

function renderTeacherManagement() {
  if (!teacher()) return;

  const slots = db.slots
    .filter(s => s.teacherId === userId)
    .sort((a, b) =>
      (a.date + a.start).localeCompare(b.date + b.start)
    );

  $("ownSlots").innerHTML = slots.length
    ? slots.map(s => `
        <div class="schedule-row">
          <div>
            <strong>${dateLabel(s.date)}</strong>
            <small>${esc(s.start)}〜${esc(s.end)}</small>
          </div>
          <button class="outline"
            data-edit-slot="${s.id}">編集</button>
        </div>
      `).join("")
    : '<p class="empty">登録された空き時間はありません</p>';

  const bookings = db.bookings
    .filter(b => b.teacherId === userId)
    .sort((a, b) => a.date.localeCompare(b.date));

  $("teacherBookings").innerHTML = bookings.length
    ? bookings.map(b => {
        const s = db.slots.find(x => x.id === b.slotId);
        const p = user(b.studentId);

        return `
          <div class="card">
            <strong>${esc(p?.name || "生徒")}</strong>
            <p>
              ${dateLabel(b.date)}
              ${s ? esc(s.start) + "〜" + esc(s.end) : ""}
            </p>
            <p class="status">${bookingText(b.status)}</p>
            ${b.status === "pending"
              ? `<button class="primary"
                   data-booking-action="approved:${b.id}">
                   承認
                 </button>
                 <button class="outline"
                   data-booking-action="rejected:${b.id}">
                   断る
                 </button>`
              : ""}
          </div>
        `;
      }).join("")
    : '<p class="empty">面談予約の申請はありません</p>';

  $("ownSlots").querySelectorAll("[data-edit-slot]")
    .forEach(button => {
      button.onclick = () => openSlot(button.dataset.editSlot);
    });

  $("teacherBookings")
    .querySelectorAll("[data-booking-action]")
    .forEach(button => {
      button.onclick = () => {
        const [status, id] =
          button.dataset.bookingAction.split(":");

        const booking = db.bookings.find(x =>
          x.id === id && x.teacherId === userId &&
          x.status === "pending"
        );

        if (!booking) return;

        booking.status = status;
        save();
        render();
      };
    });
}

$("addSlotBtn").onclick = () => openSlot();

function openSlot(id = null) {
  if (!teacher()) return;

  editingSlot = id;

  const s = db.slots.find(x =>
    x.id === id && x.teacherId === userId
  );

  $("slotDate").value = s?.date || "";
  $("slotStart").value = s?.start || "";
  $("slotEnd").value = s?.end || "";
  $("deleteSlot").hidden = !s;

  $("slotDialog").showModal();
}

$("cancelSlot").onclick = () => $("slotDialog").close();

$("slotForm").onsubmit = e => {
  e.preventDefault();
  if (!teacher()) return;

  const date = $("slotDate").value;
  const start = $("slotStart").value;
  const end = $("slotEnd").value;

  if (!date || !start || !end) {
    alert("日付・開始時刻・終了時刻を入力してください");
    return;
  }

  if (start >= end) {
    alert("終了時刻は開始時刻より後にしてください");
    return;
  }

  if (date < today()) {
    alert("過去の日付は登録できません");
    return;
  }

  const old = db.slots.find(s =>
    s.id === editingSlot && s.teacherId === userId
  );

  if (db.slots.some(s =>
    s.teacherId === userId &&
    s.id !== editingSlot &&
    s.date === date &&
    start < s.end &&
    end > s.start
  )) {
    alert("空き時間が重複しています");
    return;
  }

  if (old) {
    if (activeBooking(old.id) &&
      (old.date !== date ||
       old.start !== start ||
       old.end !== end)) {
      alert("予約があるため日時を変更できません");
      return;
    }

    Object.assign(old, { date, start, end });
  } else {
    db.slots.push({
      id: uid(), teacherId: userId, date, start, end
    });
  }

  save();
  $("slotDialog").close();
  render();
};

$("deleteSlot").onclick = () => {
  const s = db.slots.find(x =>
    x.id === editingSlot && x.teacherId === userId
  );

  if (!s) return;

  if (activeBooking(s.id)) {
    alert("予約があるため削除できません");
    return;
  }

  if (!confirm("空き時間を削除しますか？")) return;

  db.slots = db.slots.filter(x => x.id !== s.id);

  save();
  $("slotDialog").close();
  render();
};

/* ==========================================
   メッセージ送受信
========================================== */

function renderMessages() {
  if (!personId) return;

  const p = user(personId);
  if (!p) return;

  const allowed =
    (teacher() && p.role === "student") ||
    (student() && p.role === "teacher") ||
    (student() && p.role === "student" &&
      areFriends(userId, personId));

  $("messageForm").hidden = !allowed;

  if (!allowed) {
    $("messages").innerHTML =
      '<p class="empty">メッセージを送れません</p>';
    return;
  }

  markRead(personId);

  const list = messagesBetween(userId, personId);

  $("messages").innerHTML = list.length
    ? list.map(m => `
        <div class="bubble ${m.from === userId ? "mine" : ""}">
          <small>${esc(user(m.from)?.name)}</small>
          ${esc(m.text)}
        </div>
      `).join("")
    : '<p class="empty">まだメッセージはありません</p>';

  renderBadges();
}

$("messageForm").onsubmit = e => {
  e.preventDefault();
  if (!personId) return;

  const p = user(personId);

  const allowed =
    (teacher() && p?.role === "student") ||
    (student() && p?.role === "teacher") ||
    (student() && p?.role === "student" &&
      areFriends(userId, personId));

  if (!allowed) return;

  const text = $("messageText").value.trim();
  if (!text) return;

  db.messages.push({
    id: uid(),
    from: userId,
    to: personId,
    text,
    read: false,
    createdAt: new Date().toISOString()
  });

  $("messageText").value = "";
  save();
  render();
};

/* ==========================================
   初期表示
========================================== */

$("authScreen").hidden = false;
$("appScreen").hidden = true;
authMode("login");
