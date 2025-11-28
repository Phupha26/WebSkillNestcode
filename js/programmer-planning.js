// ==========================================
// DIALOGUE DATA
// ==========================================

const dialogueData = [
  {
    speaker: "Mentor",
    text: "ยินดีต้อนรับเข้าสู่เส้นทางของ Programmer ผมจะแนะนำคุณตลอดเส้นทางนี้",
    choices: []
  },
  {
    speaker: "Mentor", // จะถูกแทนที่ด้วยชื่อจริงของ User
    text: "ผมจะเป็นอาจารย์สอน Programmer ของคุณ ถ้าคุณพร้อมแล้วเรามาเริ่มกันเลย!!",
    choices: []
  },
  {
    speaker: "Player", // จะถูกแทนที่ด้วยชื่อจริงของ User
    text: "ขอบคุณครับ! ผมพร้อมแล้วที่จะเรียนรู้การเขียนโค้ดแล้ว",
    choices: []
  },
  {
    speaker: "Mentor",
    text: "โอเคครับในเรื่องแรกจะเป็นเกี่ยวกับ Programming Language เราจะเรียนเกี่ยวกับ ตัวแปรและชนิดข้อมูล กัน",
    choices: []
  }
];


// ==========================================
// DOM ELEMENTS
// ==========================================

const playerChar = document.getElementById('playerChar');
const mentorChar = document.getElementById('mentorChar');
const dialogueBox = document.getElementById('dialogue-box');
const dialogueText = document.getElementById('dialogue-text');
const dialogueName = document.getElementById('dialogue-name');
const dialogueChoices = document.getElementById('dialogue-choices');
const nextDialogueBtn = document.getElementById('next-dialogue-btn');

const resultScreen = document.getElementById('result-screen');
const resultHeading = document.getElementById('result-heading');
const resultMessage = document.getElementById('result-message');
const goToNextBtn = document.getElementById('goToNextBtn');

// ==========================================
// GAME STATE VARIABLES
// ==========================================

let currentDialogueIndex = 0;
let typingSpeed = 30;
let currentTypingInterval;
let userName = "Player"; // ตัวแปรเก็บชื่อ User

// ==========================================
// ANIMATION FUNCTIONS
// ==========================================

function animateCharactersAndDialogue() {
  // Show characters
  playerChar.style.opacity = '1';
  playerChar.style.transform = 'translateY(0)';
  mentorChar.style.opacity = '1';
  mentorChar.style.transform = 'translateY(0)';

  // Show dialogue box
  dialogueBox.style.opacity = '1';
  dialogueBox.style.transform = 'translateY(0)';

  // Start dialogue after animation
  setTimeout(() => {
    displayDialogue();
  }, 1500);
}

// ==========================================
// DIALOGUE FUNCTIONS
// ==========================================

function displayDialogue() {
  if (currentDialogueIndex < dialogueData.length) {
    const currentLine = dialogueData[currentDialogueIndex];
    
    // แทนที่ "Player" ด้วยชื่อจริงของ User
    const speakerName = currentLine.speaker === "Player" ? userName : currentLine.speaker;
    dialogueName.textContent = speakerName;
    
    dialogueChoices.innerHTML = '';
    nextDialogueBtn.style.display = 'none';

    // Start typing effect
    typeText(currentLine.text, () => {
      if (currentLine.choices && currentLine.choices.length > 0) {
        // Show choices
        currentLine.choices.forEach(choice => {
          const button = document.createElement('button');
          button.textContent = choice.text;
          button.className = 'btn btn-amber choice-btn';
          button.onclick = () => handleChoice(choice.next);
          dialogueChoices.appendChild(button);
        });
      } else {
        // Show next button
        nextDialogueBtn.style.display = 'block';
      }
    });

  } else {
    // End of intro dialogue
    showResult({
      heading: "Start Your Journey",
      message: `${userName} คุณพร้อมที่จะเริ่มเรียนในเส้นทาง Programmer Planning แล้ว!`,
      nextPage: "../../lessons/programmer-lesson.html"
    });
  }
}

function typeText(text, callback) {
  let i = 0;
  dialogueText.textContent = '';
  clearInterval(currentTypingInterval);

  currentTypingInterval = setInterval(() => {
    if (i < text.length) {
      dialogueText.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(currentTypingInterval);
      if (callback) callback();
    }
  }, typingSpeed);
}

// ==========================================
// CHOICE HANDLER
// ==========================================

function handleChoice(nextState) {
  if (nextState === "start_game") {
    console.log("Starting lesson...");
    
    // ซ่อนบทสนทนา
    dialogueBox.style.display = 'none';
    playerChar.style.opacity = '0';
    
    // โหลดหน้าเนื้อหาบทเรียน
    window.location.href = "../../lesson/programmer-lesson.html";
  }
}

// ==========================================
// RESULT SCREEN
// ==========================================

function showResult(result) {
  dialogueBox.style.display = 'none';
  resultScreen.style.display = 'block';

  resultHeading.textContent = result.heading;
  resultMessage.textContent = result.message;
  goToNextBtn.onclick = () => {
    window.location.href = result.nextPage;
  };
}

// ==========================================
// EVENT LISTENERS
// ==========================================

nextDialogueBtn.addEventListener('click', () => {
  currentDialogueIndex++;
  displayDialogue();
});

// ==========================================
// INITIALIZATION
// ==========================================
import { getCurrentUser } from '../../js/firebase-auth-service.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Check login status
  const user = await getCurrentUser();
  if (!user) {
    alert("Please log in to start your journey!");
    window.location.href = "../login.html";
    return;
  }

  // ดึงชื่อ User จาก Firebase Auth
  // ใช้ displayName ถ้ามี ถ้าไม่มีให้ใช้ email แทน
  userName = user.firstName || user.email.split('@')[0] || "Player";
  console.log("User Name:", userName);

  // Wait for user click to start
  const clickToStart = () => {
    document.body.removeEventListener('click', clickToStart);
    animateCharactersAndDialogue();

    const startMessage = document.getElementById('clickToStartMessage');
    if (startMessage) {
      startMessage.style.display = 'none';
    }
  };

  document.body.addEventListener('click', clickToStart);
});