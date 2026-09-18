// キャラクター選択の処理
const characterCards = document.querySelectorAll('.character-card');
let selectedCharacter = 'volgad'; // デフォルトでヴォルガドを選択

characterCards.forEach(card => {
    card.addEventListener('click', () => {
        // すべてのカードから選択状態を解除
        characterCards.forEach(c => {
            c.classList.remove('selected');
            c.classList.remove('border-blue-500');
            c.classList.add('border-gray-700');
        });

        // クリックされたカードを選択状態にする
        card.classList.add('selected');
        card.classList.remove('border-gray-700');
        card.classList.add('border-blue-500');

        selectedCharacter = card.dataset.character;
    });
});

// 難易度選択の処理
const difficultyButtons = document.querySelectorAll('.difficulty-btn');
let selectedDifficulty = 'normal'; // デフォルトで普通を選択

difficultyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // すべてのボタンからアクティブ状態を解除
        difficultyButtons.forEach(b => b.classList.remove('active'));

        // クリックされたボタンをアクティブ状態にする
        btn.classList.add('active');
        selectedDifficulty = btn.dataset.difficulty;
    });
});

// 決定ボタンの処理
document.getElementById('startButton').addEventListener('click', () => {
    // キャラクター名をマッピング
    const characterName = selectedCharacter || 'volgad';

    // battle.htmlにGETパラメータを付けて遷移
    const url = `battle.html?character=${characterName}&difficulty=${selectedDifficulty}`;
    window.location.href = url;
});