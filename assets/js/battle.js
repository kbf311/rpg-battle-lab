// キャラクターベースクラス
class Character {
    constructor(imageFileName, name, maxHP, maxMP, physicalAttack, magicalAttack, luck, buff, debuff) {
        this.imageFileName = imageFileName;
        this.name = name;
        this.maxHP = maxHP;
        this.currentHP = maxHP;
        this.maxMP = maxMP;
        this.currentMP = maxMP;
        this.physicalAttack = physicalAttack;
        this.magicalAttack = magicalAttack;
        this.luck = luck;
        this.buff = buff; // 有利な効果   
        this.debuff = debuff; // 不利な効果
    }

    // HPを設定
    setHP(value) {
        this.currentHP = Math.max(0, Math.min(value, this.maxHP));
    }

    // HPを消費
    consumeHP(amount) {
        if (this.currentHP >= amount) {
            this.setHP(this.currentHP - amount);
            return true;
        }
        return false;
    }

    // HPを回復
    healHP(amount) {
        const nextHP = Math.max(1, this.currentHP + amount);  // 1未満にはならないようにする
        this.setHP(nextHP);
    }

    // HPにダメージを与える
    takeDamage(amount) {
        this.setHP(this.currentHP - amount);
        return this.currentHP <= 0;
    }

    // MPを設定
    setMP(value) {
        this.currentMP = value;
        if (this.currentMP > this.maxMP) {
            this.currentMP = this.maxMP;
        } else if (this.currentMP < 0) {
            this.currentMP = 0;
        }
    }

    // MPを消費
    consumeMP(amount) {
        if (this.currentMP >= amount) {
            this.setMP(this.currentMP - amount);
            return true;
        }
        return false;
    }

    // MPを回復
    restoreMP(amount) {
        this.setMP(this.currentMP + amount);
    }
    
    // 物理攻撃力を増加
    increasePhysicalAttack(amount) {
        this.physicalAttack = Math.max(1, this.physicalAttack + amount); // 物理攻撃力の下限は1
    }
    
    // 魔法攻撃力を増加
    increaseMagicalAttack(amount) {
        this.magicalAttack = Math.max(1, this.magicalAttack + amount); // 魔法攻撃力の下限は1
    }
    
    // 幸運度を増加
    increaseLuck(amount) {
        this.luck = Math.max(100, this.luck + amount); // 幸運度の下限は100
    }
    
    // 最大HPを増加
    increaseMaxHP(amount) {
        this.maxHP = Math.max(1, this.maxHP + amount); // 最大HPの下限は1
        if (this.currentHP > this.maxHP) {
            this.currentHP = this.maxHP;
        }
    }

    // 最大MPを増加
    increaseMaxMP(amount) {
        this.maxMP = Math.max(1, this.maxMP + amount); // 最大MPの下限は1
        if (this.currentMP > this.maxMP) {
            this.currentMP = this.maxMP;
        }
    }    
}

// プレイヤークラス
class Player extends Character {
    constructor(imageFileName, name, maxHP, maxMP, physicalAttack, magicalAttack, luck) {
        super(imageFileName, name, maxHP, maxMP, physicalAttack, magicalAttack, luck);
    }
}

// エネミークラス
class Enemy extends Character {
    constructor(imageFileName, name, maxHP, maxMP, physicalAttack, magicalAttack, luck) {
        super(imageFileName, name, maxHP, maxMP, physicalAttack, magicalAttack, luck);
    }
}

/**
 * GETパラメータを取得する関数
 * @param {string} paramName - 取得したいパラメータ名
 * @returns {string|null} パラメータの値、存在しない場合はnull
 */
function getURLParameter(paramName) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(paramName);
}

/**
 * キャラクターに基づいてPlayerの初期値を取得
 * @param {string} character - キャラクター名 (volgad, isolde, lunaty)
 * @returns {Object} Playerの初期値
 */
function getPlayerStats(character) {
    const statsMap = {
        'volgad': {
            imageFileName: 'assets/img/volgad.jpg',
            name: 'ヴォルガド',
            maxHP: 5000,
            maxMP: 200,
            physicalAttack: 500,
            magicalAttack: 500,
            luck: 100
        },
        'isolde': {
            imageFileName: 'assets/img/isolde.jpg',
            name: 'イゾルテ',
            maxHP: 2500,
            maxMP: 1000,
            physicalAttack: 100,
            magicalAttack: 2500,
            luck: 100
        },
        'lunaty': {
            imageFileName: 'assets/img/lunaty.jpg',
            name: 'ルナティ',
            maxHP: 2500,
            maxMP: 200,
            physicalAttack: 250,
            magicalAttack: 250,
            luck: 500
        }
    };
    
    // デフォルトはvolgad
    return statsMap[character] || statsMap['volgad'];
}

/**
 * 難易度に基づいてEnemyの初期値を取得
 * @param {string} difficulty - 難易度 (easy, normal, hard)
 * @returns {Object} Enemyの初期値
 */
function getEnemyStats(difficulty) {
    const statsMap = {
        'easy': {
            imageFileName: 'assets/img/dark-load.jpg',
            name: 'ザコ魔王',
            maxHP: 10000,
            maxMP: 500,
            physicalAttack: 500,
            magicalAttack: 500,
            luck: 100
        },
        'normal': {
            imageFileName: 'assets/img/dark-load.jpg',
            name: '魔王',
            maxHP: 32767,
            maxMP: 1000,
            physicalAttack: 500,
            magicalAttack: 500,
            luck: 100
        },
        'hard': {
            imageFileName: 'assets/img/dark-load.jpg',
            name: 'スーパー魔王',
            maxHP: 65535,
            maxMP: 9999,
            physicalAttack: 500,
            magicalAttack: 500,
            luck: 500
        }
    };
    
    // デフォルトはnormal
    return statsMap[difficulty] || statsMap['normal'];
}

// GETパラメータからcharacterとdifficultyを取得
const characterParam = getURLParameter('character') || 'volgad';
const difficultyParam = getURLParameter('difficulty') || 'normal';

// PlayerとEnemyのインスタンスを作成
const playerStats = getPlayerStats(characterParam);
const enemyStats = getEnemyStats(difficultyParam);

const player = new Player(
    playerStats.imageFileName,
    playerStats.name,
    playerStats.maxHP,
    playerStats.maxMP,
    playerStats.physicalAttack,
    playerStats.magicalAttack,
    playerStats.luck
);

const enemy = new Enemy(
    enemyStats.imageFileName,
    enemyStats.name,
    enemyStats.maxHP,
    enemyStats.maxMP,
    enemyStats.physicalAttack,
    enemyStats.magicalAttack,
    enemyStats.luck
);

// 演出スキップフラグ（localStorageで状態保存）
let isSkipAnimation = localStorage.getItem('rpg_skip_animation') === 'true';

// ユーティリティヘルパー関数
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, isSkipAnimation ? 0 : ms));

/**
 * バトルログをフラッシュさせる関数
 */
function flashBattleLog() {
    if (isSkipAnimation) return;
    const battleLog = document.getElementById('battleLog');
    if (!battleLog) return;
    battleLog.classList.remove('flash');
    void battleLog.offsetWidth;
    battleLog.classList.add('flash');
}

/**
 * 要素にアニメーションクラスを付与し、完了後に除去する関数
 * @param {HTMLElement} element - 対象要素
 * @param {string} animationClass - アニメーションクラス名
 * @param {number} duration - 持続時間(ms)
 */
function triggerAnimation(element, animationClass, duration = 800) {
    if (!element || isSkipAnimation) return;
    element.classList.remove('fade-in');
    element.classList.remove(animationClass);
    void element.offsetWidth; // リフローを強制
    element.classList.add(animationClass);
    setTimeout(() => {
        element.classList.remove(animationClass);
    }, duration);
}

/**
 * キャラクターカード上にフローティング演出（ポップアップ数値/文字）を表示する
 * @param {HTMLElement} cardElement - 表示先のキャラクターカード要素
 * @param {string} text - 表示するテキスト
 * @param {string} type - 'damage' | 'heal' | 'buff' | 'debuff'
 */
function showFloatingPopup(cardElement, text, type = 'damage') {
    if (!cardElement || isSkipAnimation) return;
    const popup = document.createElement('div');
    popup.className = `floating-popup popup-${type}`;
    popup.textContent = text;
    cardElement.appendChild(popup);
    popup.addEventListener('animationend', () => {
        popup.remove();
    });
}

// スキルカードクラス
class SkillCard {
    constructor({ skillName,rarity,description,physicalDamageMultiplier,magicalDamageMultiplier,damageRange,successProbability,hpCost,mpCost,selfPhysicalAttackIncrease,targetPhysicalAttackIncrease,selfMagicalAttackIncrease,targetMagicalAttackIncrease,selfLuckIncrease,targetLuckIncrease,selfMaxHPIncrease,targetMaxHPIncrease,selfHPRecovery,targetHPRecovery,selfMaxMPIncrease,targetMaxMPIncrease,selfMPRecovery,targetMPRecovery,isPlayerOnly }) {
        this.skillName = skillName // スキル名
        this.rarity = rarity // レアリティ
        this.description = description // 説明文
        this.physicalDamageMultiplier = physicalDamageMultiplier // 物理ダメージ倍率
        this.magicalDamageMultiplier = magicalDamageMultiplier // 魔法ダメージ倍率
        this.damageRange = damageRange // ダメージ幅
        this.successProbability = successProbability // 成功確率
        this.hpCost = hpCost // 消費HP
        this.mpCost = mpCost // 消費MP
        this.selfPhysicalAttackIncrease = selfPhysicalAttackIncrease // 自分の物理攻撃力増加量
        this.targetPhysicalAttackIncrease = targetPhysicalAttackIncrease // 相手の物理攻撃力増加量
        this.selfMagicalAttackIncrease = selfMagicalAttackIncrease // 自分の魔法攻撃力増加量
        this.targetMagicalAttackIncrease = targetMagicalAttackIncrease // 相手の魔法攻撃力増加量
        this.selfLuckIncrease = selfLuckIncrease // 自分の運増加量
        this.targetLuckIncrease = targetLuckIncrease // 相手の運増加量
        this.selfMaxHPIncrease = selfMaxHPIncrease // 自分の最大HP増加量
        this.targetMaxHPIncrease = targetMaxHPIncrease // 相手の最大HP増加量
        this.selfHPRecovery = selfHPRecovery // 自分の現在HP回復量
        this.targetHPRecovery = targetHPRecovery // 相手の現在HP回復量
        this.selfMaxMPIncrease = selfMaxMPIncrease // 自分の最大MP増加量
        this.targetMaxMPIncrease = targetMaxMPIncrease // 相手の最大MP増加量
        this.selfMPRecovery = selfMPRecovery // 自分の現在MP回復量
        this.targetMPRecovery = targetMPRecovery // 相手の現在MP回復量
        this.isPlayerOnly = isPlayerOnly // プレイヤー専用フラグ
    }

    /**
     * スキルカードの効果を発動する
     * @param {Player|Enemy} caster - 使用者（Player or Enemy）
     * @returns {Promise<boolean>} 相手が倒れたかどうか
     */
    async activate(caster) {
        const isPlayerCaster = caster instanceof Player;
        const target = isPlayerCaster ? enemy : player;
        const casterCardClass = isPlayerCaster ? 'character-card-player' : 'character-card-enemy';
        const targetCardClass = isPlayerCaster ? 'character-card-enemy' : 'character-card-player';
        const casterCardElement = document.querySelector(`.${casterCardClass}`);
        const targetCardElement = document.querySelector(`.${targetCardClass}`);
        const battleContainer = document.getElementById('battleContainer') || document.body;

        // 1. 行動開始のメッセージ
        addBattleLogMessage(`\n\n【${caster.name} の ${this.skillName}】`);
        flashBattleLog();
        await sleep(400);

        // 成功確率の処理
        if (Math.random() * 100 > this.successProbability) {
            addBattleLogMessage(`\n失敗！`);
            showFloatingPopup(casterCardElement, '失敗！', 'debuff');
            flashBattleLog();
            await sleep(500);
            return false;
        }

        // HPコストの処理
        if (!caster.consumeHP(this.hpCost)) {
            addBattleLogMessage(`\n${caster.name} はHPが不足しているため、スキルを使用できなかった！`);
            flashBattleLog();
            await sleep(500);
            return false;
        }

        // MPコストの処理
        if (!caster.consumeMP(this.mpCost)) {
            addBattleLogMessage(`\n${caster.name} はMPが不足しているため、スキルを使用できなかった！`);
            flashBattleLog();
            await sleep(500);
            return false;
        }

        // コスト消費があった場合はカード表示を即座に反映
        if (this.hpCost > 0 || this.mpCost > 0) {
            updateCharacterCard(casterCardClass, caster);
        }

        let isDefeated = false;

        // A. 相手にダメージ（攻撃演出）
        if (this.physicalDamageMultiplier > 0 || this.magicalDamageMultiplier > 0) {
            // ベースダメージ計算
            const baseDamage = (caster.physicalAttack * this.physicalDamageMultiplier / 100) + (caster.magicalAttack * this.magicalDamageMultiplier / 100);
            const damageVariation = (Math.random() * 2 - 1) * (this.damageRange / 100);
            const finalDamage = Math.max(1, Math.floor(baseDamage * (1 + damageVariation)));

            // 被弾アニメーション：相手を揺らす
            triggerAnimation(targetCardElement, 'damage-shake', 600);

            // 高レアリティ（rare, epic, legendary）や高威力魔法は大揺れ
            if (this.rarity === 'rare' || this.rarity === 'epic' || this.rarity === 'legendary' || (this.physicalDamageMultiplier + this.magicalDamageMultiplier >= 300)) {
                triggerAnimation(battleContainer, 'screen-shake', 500);
            }

            // ダメージポップアップ
            showFloatingPopup(targetCardElement, `-${finalDamage.toLocaleString()}`, 'damage');

            // ダメージを適用
            isDefeated = target.takeDamage(finalDamage);
            updateCharacterCard(targetCardClass, target);

            // バトルログにメッセージを表示
            addBattleLogMessage(`\n${caster.name} が ${target.name} に ${finalDamage.toLocaleString()} のダメージを与えた！`);
            flashBattleLog();

            if (isDefeated) {
                addBattleLogMessage(`\n${target.name} は倒れた！`);
                flashBattleLog();
            }

            await sleep(650);

            if (isDefeated) {
                return true;
            }
        }

        // B. 自分の回復（HP/MP回復演出）
        const hasHeal = this.selfHPRecovery > 0 || this.selfMPRecovery > 0;
        if (hasHeal) {
            // 回復アニメーション：自分を緑に発光・パルス
            triggerAnimation(casterCardElement, 'heal-pulse', 800);

            if (this.selfHPRecovery > 0) {
                caster.healHP(this.selfHPRecovery);
                showFloatingPopup(casterCardElement, `+${this.selfHPRecovery.toLocaleString()} HP`, 'heal');
                addBattleLogMessage(`\n${caster.name} のHPが ${this.selfHPRecovery.toLocaleString()} 回復した！`);
            }
            if (this.selfMPRecovery > 0) {
                caster.restoreMP(this.selfMPRecovery);
                showFloatingPopup(casterCardElement, `+${this.selfMPRecovery.toLocaleString()} MP`, 'heal');
                addBattleLogMessage(`\n${caster.name} のMPが ${this.selfMPRecovery.toLocaleString()} 回復した！`);
            }

            updateCharacterCard(casterCardClass, caster);
            flashBattleLog();
            await sleep(600);
        }

        // C. 自分にバフ（攻撃力、幸運、最大HP/MP増加）
        const hasBuff = this.selfPhysicalAttackIncrease > 0 || this.selfMagicalAttackIncrease > 0 || 
                        this.selfLuckIncrease > 0 || this.selfMaxHPIncrease > 0 || this.selfMaxMPIncrease > 0;
        if (hasBuff) {
            // バフアニメーション：自分を金色に発光・パルス
            triggerAnimation(casterCardElement, 'buff-pulse', 800);
            const buffTexts = [];

            if (this.selfPhysicalAttackIncrease > 0) {
                caster.increasePhysicalAttack(this.selfPhysicalAttackIncrease);
                addBattleLogMessage(`\n${caster.name} は物理攻撃力が ${this.selfPhysicalAttackIncrease} 上がった！`);
                buffTexts.push(`物攻+${this.selfPhysicalAttackIncrease}`);
            }
            if (this.selfMagicalAttackIncrease > 0) {
                caster.increaseMagicalAttack(this.selfMagicalAttackIncrease);
                addBattleLogMessage(`\n${caster.name} は魔法攻撃力が ${this.selfMagicalAttackIncrease} 上がった！`);
                buffTexts.push(`魔攻+${this.selfMagicalAttackIncrease}`);
            }
            if (this.selfLuckIncrease > 0) {
                caster.increaseLuck(this.selfLuckIncrease);
                addBattleLogMessage(`\n${caster.name} は幸運度が ${this.selfLuckIncrease} 上がった！`);
                buffTexts.push(`運+${this.selfLuckIncrease}`);
            }
            if (this.selfMaxHPIncrease > 0) {
                caster.increaseMaxHP(this.selfMaxHPIncrease);
                addBattleLogMessage(`\n${caster.name} は最大HPが ${this.selfMaxHPIncrease} 上がった！`);
                buffTexts.push(`最大HP+${this.selfMaxHPIncrease}`);
            }
            if (this.selfMaxMPIncrease > 0) {
                caster.increaseMaxMP(this.selfMaxMPIncrease);
                addBattleLogMessage(`\n${caster.name} は最大MPが ${this.selfMaxMPIncrease} 上がった！`);
                buffTexts.push(`最大MP+${this.selfMaxMPIncrease}`);
            }

            showFloatingPopup(casterCardElement, buffTexts.join(' ') || 'BUFF UP!', 'buff');
            updateCharacterCard(casterCardClass, caster);
            flashBattleLog();
            await sleep(600);
        }

        // D. 相手にデバフ（相手ステータス減少、MP削り等）
        const hasDebuff = this.targetPhysicalAttackIncrease < 0 || this.targetMagicalAttackIncrease < 0 || 
                          this.targetLuckIncrease < 0 || this.targetMaxHPIncrease < 0 || 
                          this.targetMaxMPIncrease < 0 || this.targetMPRecovery < 0 || this.targetHPRecovery < 0;
        if (hasDebuff) {
            // デバフアニメーション：相手を紫色に歪ませる
            triggerAnimation(targetCardElement, 'debuff-pulse', 800);
            const debuffTexts = [];

            if (this.targetPhysicalAttackIncrease < 0) {
                target.increasePhysicalAttack(this.targetPhysicalAttackIncrease);
                addBattleLogMessage(`\n${target.name} の物理攻撃力を ${Math.abs(this.targetPhysicalAttackIncrease)} 下げた！`);
                debuffTexts.push(`物攻-${Math.abs(this.targetPhysicalAttackIncrease)}`);
            }
            if (this.targetMagicalAttackIncrease < 0) {
                target.increaseMagicalAttack(this.targetMagicalAttackIncrease);
                addBattleLogMessage(`\n${target.name} の魔法攻撃力を ${Math.abs(this.targetMagicalAttackIncrease)} 下げた！`);
                debuffTexts.push(`魔攻-${Math.abs(this.targetMagicalAttackIncrease)}`);
            }
            if (this.targetLuckIncrease < 0) {
                target.increaseLuck(this.targetLuckIncrease);
                addBattleLogMessage(`\n${target.name} の幸運度を ${Math.abs(this.targetLuckIncrease)} 下げた！`);
                debuffTexts.push(`運-${Math.abs(this.targetLuckIncrease)}`);
            }
            if (this.targetMaxHPIncrease < 0) {
                target.increaseMaxHP(this.targetMaxHPIncrease);
                addBattleLogMessage(`\n${target.name} の最大HPを ${Math.abs(this.targetMaxHPIncrease)} 下げた！`);
                debuffTexts.push(`最大HP-${Math.abs(this.targetMaxHPIncrease)}`);
            }
            if (this.targetMaxMPIncrease < 0) {
                target.increaseMaxMP(this.targetMaxMPIncrease);
                addBattleLogMessage(`\n${target.name} の最大MPを ${Math.abs(this.targetMaxMPIncrease)} 下げた！`);
                debuffTexts.push(`最大MP-${Math.abs(this.targetMaxMPIncrease)}`);
            }
            if (this.targetMPRecovery < 0) {
                target.restoreMP(this.targetMPRecovery);
                addBattleLogMessage(`\n${target.name} のMPが ${Math.abs(this.targetMPRecovery)} 下がった！`);
                debuffTexts.push(`MP-${Math.abs(this.targetMPRecovery)}`);
            }
            if (this.targetHPRecovery < 0) {
                target.healHP(this.targetHPRecovery);
                addBattleLogMessage(`\n${target.name} のHPが ${Math.abs(this.targetHPRecovery)} 下がった！`);
                debuffTexts.push(`HP-${Math.abs(this.targetHPRecovery)}`);
            }

            showFloatingPopup(targetCardElement, debuffTexts.join(' ') || 'DEBUFF!', 'debuff');
            updateCharacterCard(targetCardClass, target);
            flashBattleLog();
            await sleep(600);
        }

        // その他（稀なステータス変更）
        let otherChanges = false;
        if (this.selfPhysicalAttackIncrease < 0) {
            caster.increasePhysicalAttack(this.selfPhysicalAttackIncrease);
            addBattleLogMessage(`\n${caster.name} は物理攻撃力が ${Math.abs(this.selfPhysicalAttackIncrease)} 下がった！`);
            otherChanges = true;
        }
        if (this.selfMagicalAttackIncrease < 0) {
            caster.increaseMagicalAttack(this.selfMagicalAttackIncrease);
            addBattleLogMessage(`\n${caster.name} は魔法攻撃力が ${Math.abs(this.selfMagicalAttackIncrease)} 下がった！`);
            otherChanges = true;
        }
        if (this.selfHPRecovery < 0) {
            caster.healHP(this.selfHPRecovery);
            addBattleLogMessage(`\n${caster.name} のHPが ${Math.abs(this.selfHPRecovery)} 下がった！`);
            otherChanges = true;
        }
        if (this.selfMPRecovery < 0) {
            caster.restoreMP(this.selfMPRecovery);
            addBattleLogMessage(`\n${caster.name} のMPが ${Math.abs(this.selfMPRecovery)} 下がった！`);
            otherChanges = true;
        }
        if (this.targetPhysicalAttackIncrease > 0) {
            target.increasePhysicalAttack(this.targetPhysicalAttackIncrease);
            addBattleLogMessage(`\n${target.name} の物理攻撃力を ${this.targetPhysicalAttackIncrease} 上げた！`);
            otherChanges = true;
        }
        if (this.targetMagicalAttackIncrease > 0) {
            target.increaseMagicalAttack(this.targetMagicalAttackIncrease);
            addBattleLogMessage(`\n${target.name} の魔法攻撃力を ${this.targetMagicalAttackIncrease} 上げた！`);
            otherChanges = true;
        }
        if (this.targetHPRecovery > 0) {
            target.healHP(this.targetHPRecovery);
            addBattleLogMessage(`\n${target.name} のHPが ${this.targetHPRecovery} 回復した！`);
            otherChanges = true;
        }
        if (this.targetMPRecovery > 0) {
            target.restoreMP(this.targetMPRecovery);
            addBattleLogMessage(`\n${target.name} のMPが ${this.targetMPRecovery} 回復した！`);
            otherChanges = true;
        }

        if (otherChanges) {
            updateCharacterCard(casterCardClass, caster);
            updateCharacterCard(targetCardClass, target);
            flashBattleLog();
            await sleep(400);
        }

        return isDefeated;
    }
}

// レアリティごとに配列を持つオブジェクト
const skillCards = {
    common: [],
    uncommon: [],
    rare: [],
    epic: [],
    legendary: []
};

skillCards["common"].push(new SkillCard({skillName: "一文字斬り", rarity: "common", description: "物理攻撃力の100%前後のダメージを与える。\n真っ直ぐに敵を断つ基本技。地味ながら隙がなく、現在も多くの剣士に愛用される実戦的な伝統技能。", physicalDamageMultiplier: 100, magicalDamageMultiplier: 0, damageRange: 10, successProbability: 100, hpCost: 0, mpCost: 0, selfPhysicalAttackIncrease: 0, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 0, targetMagicalAttackIncrease: 0, selfLuckIncrease: 0, targetLuckIncrease: 0, selfMaxHPIncrease: 0, targetMaxHPIncrease: 0, selfHPRecovery: 0, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: 0, isPlayerOnly: false}));
skillCards["uncommon"].push(new SkillCard({skillName: "蒼破斬", rarity: "uncommon", description: "物理攻撃力の200%前後のダメージを与える。\n蒼い衝撃波を放つ中級剣技。威力は高いが、放つ際に「蒼き力よ…！」と叫ぶ決まりがあり、利用者が激減。", physicalDamageMultiplier: 200, magicalDamageMultiplier: 0, damageRange: 10, successProbability: 100, hpCost: 0, mpCost: 0, selfPhysicalAttackIncrease: 0, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 0, targetMagicalAttackIncrease: 0, selfLuckIncrease: 0, targetLuckIncrease: 0, selfMaxHPIncrease: 0, targetMaxHPIncrease: 0, selfHPRecovery: 0, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: 0, isPlayerOnly: false}));
skillCards["rare"].push(new SkillCard({skillName: "冥府渡しの断罪剣", rarity: "rare", description: "物理攻撃力の300%前後のダメージを与える。\n闇の力を宿した一撃。威力は絶大だが、技名を叫ぶ姿が「中二病っぽい」と揶揄され、表舞台から消えた。", physicalDamageMultiplier: 300, magicalDamageMultiplier: 0, damageRange: 10, successProbability: 100, hpCost: 0, mpCost: 0, selfPhysicalAttackIncrease: 0, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 0, targetMagicalAttackIncrease: 0, selfLuckIncrease: 0, targetLuckIncrease: 0, selfMaxHPIncrease: 0, targetMaxHPIncrease: 0, selfHPRecovery: 0, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: 0, isPlayerOnly: false}));
skillCards["epic"].push(new SkillCard({skillName: "虚空を穿つ絶影の太刀", rarity: "epic", description: "物理攻撃力の400%前後のダメージを与える。\n空間ごと敵を切り裂く奥義。かつては最強格だったが、あまりに仰々しい名前に耐えきれず、引退者が続出。", physicalDamageMultiplier: 400, magicalDamageMultiplier: 0, damageRange: 10, successProbability: 100, hpCost: 0, mpCost: 0, selfPhysicalAttackIncrease: 0, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 0, targetMagicalAttackIncrease: 0, selfLuckIncrease: 0, targetLuckIncrease: 0, selfMaxHPIncrease: 0, targetMaxHPIncrease: 0, selfHPRecovery: 0, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: 0, isPlayerOnly: false}));
skillCards["legendary"].push(new SkillCard({skillName: "終焉を刻む冥府の劫火・極点抜刀「無間地獄」", rarity: "legendary", description: "物理攻撃力の500%前後のダメージを与える。\n全てを灰にする禁忌の技。威力は神をも殺すが、名前が長すぎて噛む上に、羞恥心で精神に大ダメージを負う。", physicalDamageMultiplier: 500, magicalDamageMultiplier: 0, damageRange: 10, successProbability: 100, hpCost: 0, mpCost: 0, selfPhysicalAttackIncrease: 0, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 0, targetMagicalAttackIncrease: 0, selfLuckIncrease: 0, targetLuckIncrease: 0, selfMaxHPIncrease: 0, targetMaxHPIncrease: 0, selfHPRecovery: 0, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: 0, isPlayerOnly: false}));
skillCards["common"].push(new SkillCard({skillName: "ファイアボール", rarity: "common", description: "魔法攻撃力の100%前後のダメージを与える。\n消費MP: 100\n初歩的な火球魔法。シンプルで使い勝手も良く、今もなお魔法学校の教科書に載り続ける定番中の定番。", physicalDamageMultiplier: 0, magicalDamageMultiplier: 100, damageRange: 50, successProbability: 100, hpCost: 0, mpCost: 100, selfPhysicalAttackIncrease: 0, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 0, targetMagicalAttackIncrease: 0, selfLuckIncrease: 0, targetLuckIncrease: 0, selfMaxHPIncrease: 0, targetMaxHPIncrease: 0, selfHPRecovery: 0, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: 0, isPlayerOnly: false}));
skillCards["uncommon"].push(new SkillCard({skillName: "アイスバースト", rarity: "uncommon", description: "魔法攻撃力の200%前後のダメージを与える。\n消費MP: 100\n敵を氷結させ砕く中級魔法。強力だが、発動時にポーズ指定があり、若手魔導士以外は敬遠しがち。", physicalDamageMultiplier: 0, magicalDamageMultiplier: 200, damageRange: 50, successProbability: 100, hpCost: 0, mpCost: 100, selfPhysicalAttackIncrease: 0, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 0, targetMagicalAttackIncrease: 0, selfLuckIncrease: 0, targetLuckIncrease: 0, selfMaxHPIncrease: 0, targetMaxHPIncrease: 0, selfHPRecovery: 0, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: 0, isPlayerOnly: false}));
skillCards["rare"].push(new SkillCard({skillName: "デモンズ・ブラッド・エクスプロージョン", rarity: "rare", description: "魔法攻撃力の300%前後のダメージを与える。\n消費MP: 100\n闇の爆発を呼ぶ上位魔法。威力は凄まじいが、名前に「血」が入る痛々しさに耐えきれず、習得者が絶滅。", physicalDamageMultiplier: 0, magicalDamageMultiplier: 300, damageRange: 50, successProbability: 100, hpCost: 0, mpCost: 100, selfPhysicalAttackIncrease: 0, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 0, targetMagicalAttackIncrease: 0, selfLuckIncrease: 0, targetLuckIncrease: 0, selfMaxHPIncrease: 0, targetMaxHPIncrease: 0, selfHPRecovery: 0, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: 0, isPlayerOnly: false}));
skillCards["epic"].push(new SkillCard({skillName: "エターナル・ダークネス・ロスト・メモリー", rarity: "epic", description: "魔法攻撃力の400%前後のダメージを与える。\n消費MP: 100\n全てを忘却へ送る大魔法。名前がポエムすぎて、唱えている最中に我に返る魔導士が続出し、継承が途絶えた。", physicalDamageMultiplier: 0, magicalDamageMultiplier: 400, damageRange: 50, successProbability: 100, hpCost: 0, mpCost: 100, selfPhysicalAttackIncrease: 0, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 0, targetMagicalAttackIncrease: 0, selfLuckIncrease: 0, targetLuckIncrease: 0, selfMaxHPIncrease: 0, targetMaxHPIncrease: 0, selfHPRecovery: 0, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: 0, isPlayerOnly: false}));
skillCards["legendary"].push(new SkillCard({skillName: "アルティメット・ギルティ・カオス・プリンス・オブ・デスティニー", rarity: "legendary", description: "魔法攻撃力の500%前後のダメージを与える。\n消費MP: 100\n宇宙規模の神の魔法。自分を「運命の王子」と呼ぶ苦痛に、全ての賢者が心を折られ、使い手は皆無に。", physicalDamageMultiplier: 0, magicalDamageMultiplier: 500, damageRange: 50, successProbability: 100, hpCost: 0, mpCost: 100, selfPhysicalAttackIncrease: 0, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 0, targetMagicalAttackIncrease: 0, selfLuckIncrease: 0, targetLuckIncrease: 0, selfMaxHPIncrease: 0, targetMaxHPIncrease: 0, selfHPRecovery: 0, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: 0, isPlayerOnly: false}));
skillCards["common"].push(new SkillCard({skillName: "瞑想", rarity: "common", description: "軽く目を閉じて精神を整え、MPを100回復する。", physicalDamageMultiplier: 0, magicalDamageMultiplier: 0, damageRange: 0, successProbability: 100, hpCost: 0, mpCost: 0, selfPhysicalAttackIncrease: 0, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 0, targetMagicalAttackIncrease: 0, selfLuckIncrease: 0, targetLuckIncrease: 0, selfMaxHPIncrease: 0, targetMaxHPIncrease: 0, selfHPRecovery: 0, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 100, targetMPRecovery: 0, isPlayerOnly: false}));
skillCards["rare"].push(new SkillCard({skillName: "仮眠", rarity: "rare", description: "短時間で熟睡し、MPを500回復する。", physicalDamageMultiplier: 0, magicalDamageMultiplier: 0, damageRange: 0, successProbability: 100, hpCost: 0, mpCost: 0, selfPhysicalAttackIncrease: 0, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 0, targetMagicalAttackIncrease: 0, selfLuckIncrease: 0, targetLuckIncrease: 0, selfMaxHPIncrease: 0, targetMaxHPIncrease: 0, selfHPRecovery: 0, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 500, targetMPRecovery: 0, isPlayerOnly: false}));
skillCards["legendary"].push(new SkillCard({skillName: "霊薬", rarity: "legendary", description: "空前絶後の不味さの霊薬を飲み干し、MPを大幅に回復する。", physicalDamageMultiplier: 0, magicalDamageMultiplier: 0, damageRange: 0, successProbability: 100, hpCost: 0, mpCost: 0, selfPhysicalAttackIncrease: 0, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 0, targetMagicalAttackIncrease: 0, selfLuckIncrease: 0, targetLuckIncrease: 0, selfMaxHPIncrease: 0, targetMaxHPIncrease: 0, selfHPRecovery: 0, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 9999, targetMPRecovery: 0, isPlayerOnly: false}));
skillCards["common"].push(new SkillCard({skillName: "精神攻撃", rarity: "common", description: "成功確率25%\n相手の人格を否定して、相手のMPを1,000削る。", physicalDamageMultiplier: 0, magicalDamageMultiplier: 0, damageRange: 0, successProbability: 100, hpCost: 0, mpCost: 0, selfPhysicalAttackIncrease: 0, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 0, targetMagicalAttackIncrease: 0, selfLuckIncrease: 0, targetLuckIncrease: 0, selfMaxHPIncrease: 0, targetMaxHPIncrease: 0, selfHPRecovery: 0, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: -1000, isPlayerOnly: false}));
skillCards["rare"].push(new SkillCard({skillName: "絶望の宣告", rarity: "rare", description: "成功確率50%\n未来への希望を奪う言葉を投げかけ、相手のMPを1,000削る。", physicalDamageMultiplier: 0, magicalDamageMultiplier: 0, damageRange: 0, successProbability: 100, hpCost: 0, mpCost: 0, selfPhysicalAttackIncrease: 0, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 0, targetMagicalAttackIncrease: 0, selfLuckIncrease: 0, targetLuckIncrease: 0, selfMaxHPIncrease: 0, targetMaxHPIncrease: 0, selfHPRecovery: 0, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: -1000, isPlayerOnly: false}));
skillCards["legendary"].push(new SkillCard({skillName: "黒歴史の暴露", rarity: "legendary", description: "相手が隠したい過去を大声でバラし、相手のMPを1,000削る。", physicalDamageMultiplier: 0, magicalDamageMultiplier: 0, damageRange: 0, successProbability: 100, hpCost: 0, mpCost: 0, selfPhysicalAttackIncrease: 0, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 0, targetMagicalAttackIncrease: 0, selfLuckIncrease: 0, targetLuckIncrease: 0, selfMaxHPIncrease: 0, targetMaxHPIncrease: 0, selfHPRecovery: 0, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: -1000, isPlayerOnly: false}));
skillCards["common"].push(new SkillCard({skillName: "筋トレ", rarity: "common", description: "素早くスクワットを行い、物理攻撃力を50上げる。", physicalDamageMultiplier: 0, magicalDamageMultiplier: 0, damageRange: 0, successProbability: 100, hpCost: 0, mpCost: 0, selfPhysicalAttackIncrease: 50, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 0, targetMagicalAttackIncrease: 0, selfLuckIncrease: 0, targetLuckIncrease: 0, selfMaxHPIncrease: 0, targetMaxHPIncrease: 0, selfHPRecovery: 0, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: 0, isPlayerOnly: false}));
skillCards["uncommon"].push(new SkillCard({skillName: "プロテイン摂取", rarity: "uncommon", description: "高純度のタンパク質を補給し、物理攻撃力を100上げる。", physicalDamageMultiplier: 0, magicalDamageMultiplier: 0, damageRange: 0, successProbability: 100, hpCost: 0, mpCost: 0, selfPhysicalAttackIncrease: 100, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 0, targetMagicalAttackIncrease: 0, selfLuckIncrease: 0, targetLuckIncrease: 0, selfMaxHPIncrease: 0, targetMaxHPIncrease: 0, selfHPRecovery: 0, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: 0, isPlayerOnly: false}));
skillCards["rare"].push(new SkillCard({skillName: "リミッター解除", rarity: "rare", description: "筋肉の抑制を一時的に外し、物理攻撃力を150上げる。", physicalDamageMultiplier: 0, magicalDamageMultiplier: 0, damageRange: 0, successProbability: 100, hpCost: 0, mpCost: 0, selfPhysicalAttackIncrease: 150, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 0, targetMagicalAttackIncrease: 0, selfLuckIncrease: 0, targetLuckIncrease: 0, selfMaxHPIncrease: 0, targetMaxHPIncrease: 0, selfHPRecovery: 0, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: 0, isPlayerOnly: false}));
skillCards["epic"].push(new SkillCard({skillName: "闘争本能", rarity: "epic", description: "脳内にアドレナリンを溢れさせ、物理攻撃力を200上げる。", physicalDamageMultiplier: 0, magicalDamageMultiplier: 0, damageRange: 0, successProbability: 100, hpCost: 0, mpCost: 0, selfPhysicalAttackIncrease: 200, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 0, targetMagicalAttackIncrease: 0, selfLuckIncrease: 0, targetLuckIncrease: 0, selfMaxHPIncrease: 0, targetMaxHPIncrease: 0, selfHPRecovery: 0, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: 0, isPlayerOnly: false}));
skillCards["legendary"].push(new SkillCard({skillName: "破壊神の加護", rarity: "legendary", description: "触れるものすべてを砕く力を得て、物理攻撃力を250上げる。", physicalDamageMultiplier: 0, magicalDamageMultiplier: 0, damageRange: 0, successProbability: 100, hpCost: 0, mpCost: 0, selfPhysicalAttackIncrease: 250, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 0, targetMagicalAttackIncrease: 0, selfLuckIncrease: 0, targetLuckIncrease: 0, selfMaxHPIncrease: 0, targetMaxHPIncrease: 0, selfHPRecovery: 0, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: 0, isPlayerOnly: false}));
skillCards["common"].push(new SkillCard({skillName: "集中", rarity: "common", description: "意識を一点に集め、魔法攻撃力を50上げる。", physicalDamageMultiplier: 0, magicalDamageMultiplier: 0, damageRange: 0, successProbability: 100, hpCost: 0, mpCost: 0, selfPhysicalAttackIncrease: 0, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 50, targetMagicalAttackIncrease: 0, selfLuckIncrease: 0, targetLuckIncrease: 0, selfMaxHPIncrease: 0, targetMaxHPIncrease: 0, selfHPRecovery: 0, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: 0, isPlayerOnly: false}));
skillCards["uncommon"].push(new SkillCard({skillName: "魔力の共鳴", rarity: "uncommon", description: "周囲のマナと波長を合わせ、魔法攻撃力を100上げる。", physicalDamageMultiplier: 0, magicalDamageMultiplier: 0, damageRange: 0, successProbability: 100, hpCost: 0, mpCost: 0, selfPhysicalAttackIncrease: 0, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 100, targetMagicalAttackIncrease: 0, selfLuckIncrease: 0, targetLuckIncrease: 0, selfMaxHPIncrease: 0, targetMaxHPIncrease: 0, selfHPRecovery: 0, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: 0, isPlayerOnly: false}));
skillCards["rare"].push(new SkillCard({skillName: "第三の目", rarity: "rare", description: "世界の真理を垣間見ることにより、魔法攻撃力を150上げる。", physicalDamageMultiplier: 0, magicalDamageMultiplier: 0, damageRange: 0, successProbability: 100, hpCost: 0, mpCost: 0, selfPhysicalAttackIncrease: 0, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 150, targetMagicalAttackIncrease: 0, selfLuckIncrease: 0, targetLuckIncrease: 0, selfMaxHPIncrease: 0, targetMaxHPIncrease: 0, selfHPRecovery: 0, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: 0, isPlayerOnly: false}));
skillCards["epic"].push(new SkillCard({skillName: "禁忌の詠唱", rarity: "epic", description: "古の禁呪の一部を唱え、魔法攻撃力を200上げる。", physicalDamageMultiplier: 0, magicalDamageMultiplier: 0, damageRange: 0, successProbability: 100, hpCost: 0, mpCost: 0, selfPhysicalAttackIncrease: 0, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 200, targetMagicalAttackIncrease: 0, selfLuckIncrease: 0, targetLuckIncrease: 0, selfMaxHPIncrease: 0, targetMaxHPIncrease: 0, selfHPRecovery: 0, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: 0, isPlayerOnly: false}));
skillCards["legendary"].push(new SkillCard({skillName: "天地開闢", rarity: "legendary", description: "宇宙誕生のエネルギーを模倣し、魔法攻撃力を250上げる。", physicalDamageMultiplier: 0, magicalDamageMultiplier: 0, damageRange: 0, successProbability: 100, hpCost: 0, mpCost: 0, selfPhysicalAttackIncrease: 0, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 250, targetMagicalAttackIncrease: 0, selfLuckIncrease: 0, targetLuckIncrease: 0, selfMaxHPIncrease: 0, targetMaxHPIncrease: 0, selfHPRecovery: 0, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: 0, isPlayerOnly: false}));
skillCards["common"].push(new SkillCard({skillName: "深呼吸", rarity: "common", description: "肺活量を意識した呼吸で、最大HPを 500 上げる。\nHPも 100 回復する。", physicalDamageMultiplier: 0, magicalDamageMultiplier: 0, damageRange: 0, successProbability: 100, hpCost: 0, mpCost: 0, selfPhysicalAttackIncrease: 0, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 0, targetMagicalAttackIncrease: 0, selfLuckIncrease: 0, targetLuckIncrease: 0, selfMaxHPIncrease: 500, targetMaxHPIncrease: 0, selfHPRecovery: 100, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: 0, isPlayerOnly: true}));
skillCards["uncommon"].push(new SkillCard({skillName: "乾布摩擦", rarity: "uncommon", description: "皮膚を鍛えて抵抗力を高め、最大HPを 1,000 上げる。\nHPも 200 回復する。", physicalDamageMultiplier: 0, magicalDamageMultiplier: 0, damageRange: 0, successProbability: 100, hpCost: 0, mpCost: 0, selfPhysicalAttackIncrease: 0, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 0, targetMagicalAttackIncrease: 0, selfLuckIncrease: 0, targetLuckIncrease: 0, selfMaxHPIncrease: 1000, targetMaxHPIncrease: 0, selfHPRecovery: 200, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: 0, isPlayerOnly: true}));
skillCards["rare"].push(new SkillCard({skillName: "金剛の体", rarity: "rare", description: "体組織を一時的に硬質化し、最大HPを1,500上げる。\nHPも 300 回復する。", physicalDamageMultiplier: 0, magicalDamageMultiplier: 0, damageRange: 0, successProbability: 100, hpCost: 0, mpCost: 0, selfPhysicalAttackIncrease: 0, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 0, targetMagicalAttackIncrease: 0, selfLuckIncrease: 0, targetLuckIncrease: 0, selfMaxHPIncrease: 1500, targetMaxHPIncrease: 0, selfHPRecovery: 300, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: 0, isPlayerOnly: true}));
skillCards["epic"].push(new SkillCard({skillName: "不死鳥の血", rarity: "epic", description: "驚異的な再生能力を宿し、最大HPを 2,000 上げる。\nHPも 400 回復する。", physicalDamageMultiplier: 0, magicalDamageMultiplier: 0, damageRange: 0, successProbability: 100, hpCost: 0, mpCost: 0, selfPhysicalAttackIncrease: 0, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 0, targetMagicalAttackIncrease: 0, selfLuckIncrease: 0, targetLuckIncrease: 0, selfMaxHPIncrease: 2000, targetMaxHPIncrease: 0, selfHPRecovery: 400, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: 0, isPlayerOnly: true}));
skillCards["legendary"].push(new SkillCard({skillName: "永遠の生命", rarity: "legendary", description: "寿命という概念を克服し、最大HPを2500上げる。\nHPも 500 回復する。", physicalDamageMultiplier: 0, magicalDamageMultiplier: 0, damageRange: 0, successProbability: 100, hpCost: 0, mpCost: 0, selfPhysicalAttackIncrease: 0, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 0, targetMagicalAttackIncrease: 0, selfLuckIncrease: 0, targetLuckIncrease: 0, selfMaxHPIncrease: 2500, targetMaxHPIncrease: 0, selfHPRecovery: 500, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: 0, isPlayerOnly: true}));
skillCards["common"].push(new SkillCard({skillName: "精神統一", rarity: "common", description: "雑念を払い精神の器を広げ、最大MPを 100 上げる。", physicalDamageMultiplier: 0, magicalDamageMultiplier: 0, damageRange: 0, successProbability: 100, hpCost: 0, mpCost: 0, selfPhysicalAttackIncrease: 0, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 0, targetMagicalAttackIncrease: 0, selfLuckIncrease: 0, targetLuckIncrease: 0, selfMaxHPIncrease: 0, targetMaxHPIncrease: 0, selfHPRecovery: 0, targetHPRecovery: 0, selfMaxMPIncrease: 100, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: 0, isPlayerOnly: true}));
skillCards["rare"].push(new SkillCard({skillName: "悟り", rarity: "rare", description: "世の理を理解し始め、最大MPを 500 上げる。", physicalDamageMultiplier: 0, magicalDamageMultiplier: 0, damageRange: 0, successProbability: 100, hpCost: 0, mpCost: 0, selfPhysicalAttackIncrease: 0, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 0, targetMagicalAttackIncrease: 0, selfLuckIncrease: 0, targetLuckIncrease: 0, selfMaxHPIncrease: 0, targetMaxHPIncrease: 0, selfHPRecovery: 0, targetHPRecovery: 0, selfMaxMPIncrease: 500, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: 0, isPlayerOnly: true}));
skillCards["legendary"].push(new SkillCard({skillName: "阿頼耶識", rarity: "legendary", description: "深層意識の奥底を覚醒させ、最大MPを大幅に上げる。", physicalDamageMultiplier: 0, magicalDamageMultiplier: 0, damageRange: 0, successProbability: 100, hpCost: 0, mpCost: 0, selfPhysicalAttackIncrease: 0, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 0, targetMagicalAttackIncrease: 0, selfLuckIncrease: 0, targetLuckIncrease: 0, selfMaxHPIncrease: 0, targetMaxHPIncrease: 0, selfHPRecovery: 0, targetHPRecovery: 0, selfMaxMPIncrease: 9999, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: 0, isPlayerOnly: true}));
skillCards["common"].push(new SkillCard({skillName: "止血", rarity: "common", description: "傷口を雑に縛って、HPを 500 回復する。", physicalDamageMultiplier: 0, magicalDamageMultiplier: 0, damageRange: 0, successProbability: 100, hpCost: 0, mpCost: 0, selfPhysicalAttackIncrease: 0, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 0, targetMagicalAttackIncrease: 0, selfLuckIncrease: 0, targetLuckIncrease: 0, selfMaxHPIncrease: 0, targetMaxHPIncrease: 0, selfHPRecovery: 500, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: 0, isPlayerOnly: true}));
skillCards["uncommon"].push(new SkillCard({skillName: "栄養摂取", rarity: "uncommon", description: "携帯食を猛烈な勢いで食べて、HPを 1,000 回復する。", physicalDamageMultiplier: 0, magicalDamageMultiplier: 0, damageRange: 0, successProbability: 100, hpCost: 0, mpCost: 0, selfPhysicalAttackIncrease: 0, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 0, targetMagicalAttackIncrease: 0, selfLuckIncrease: 0, targetLuckIncrease: 0, selfMaxHPIncrease: 0, targetMaxHPIncrease: 0, selfHPRecovery: 1000, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: 0, isPlayerOnly: true}));
skillCards["rare"].push(new SkillCard({skillName: "ステロイド投与", rarity: "rare", description: "強引に代謝を活性化させ、HPを 5,000 回復する。\n代償として最大HPが 500 下がる。", physicalDamageMultiplier: 0, magicalDamageMultiplier: 0, damageRange: 0, successProbability: 100, hpCost: 0, mpCost: 0, selfPhysicalAttackIncrease: 0, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 0, targetMagicalAttackIncrease: 0, selfLuckIncrease: 0, targetLuckIncrease: 0, selfMaxHPIncrease: -500, targetMaxHPIncrease: 0, selfHPRecovery: 5000, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: 0, isPlayerOnly: true}));
skillCards["epic"].push(new SkillCard({skillName: "治癒の光", rarity: "epic", description: "消費MP: 100\n細胞を急激に分裂させ、欠損部位すら治してHPを 5,000 回復。", physicalDamageMultiplier: 0, magicalDamageMultiplier: 0, damageRange: 0, successProbability: 100, hpCost: 0, mpCost: 100, selfPhysicalAttackIncrease: 0, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 0, targetMagicalAttackIncrease: 0, selfLuckIncrease: 0, targetLuckIncrease: 0, selfMaxHPIncrease: 0, targetMaxHPIncrease: 0, selfHPRecovery: 5000, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: 0, isPlayerOnly: true}));
skillCards["uncommon"].push(new SkillCard({skillName: "無理心中", rarity: "uncommon", description: "物理攻撃力の1000%前後のダメージを与える自爆技。\n相手を道連れにする覚悟で飛び込む。", physicalDamageMultiplier: 1000, magicalDamageMultiplier: 0, damageRange: 10, successProbability: 100, hpCost: 0, mpCost: 0, selfPhysicalAttackIncrease: 0, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 0, targetMagicalAttackIncrease: 0, selfLuckIncrease: 0, targetLuckIncrease: 0, selfMaxHPIncrease: 0, targetMaxHPIncrease: 0, selfHPRecovery: -9999, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: 0, isPlayerOnly: true}));
skillCards["uncommon"].push(new SkillCard({skillName: "暴走", rarity: "uncommon", description: "魔法攻撃力の1000%前後のダメージを与える自爆技。\n消費MP: 100\n体内のエネルギーを制御不能にし、周囲を巻き込み爆発。", physicalDamageMultiplier: 0, magicalDamageMultiplier: 1000, damageRange: 50, successProbability: 100, hpCost: 0, mpCost: 0, selfPhysicalAttackIncrease: 0, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 0, targetMagicalAttackIncrease: 0, selfLuckIncrease: 0, targetLuckIncrease: 0, selfMaxHPIncrease: 0, targetMaxHPIncrease: 0, selfHPRecovery: -9999, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: 0, isPlayerOnly: true}));
skillCards["epic"].push(new SkillCard({skillName: "勇者の鼓舞", rarity: "epic", description: "勝利を確信して闘志を燃やし、すべての能力値を微増させる。", physicalDamageMultiplier: 0, magicalDamageMultiplier: 0, damageRange: 0, successProbability: 100, hpCost: 0, mpCost: 0, selfPhysicalAttackIncrease: 50, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 50, targetMagicalAttackIncrease: 0, selfLuckIncrease: 100, targetLuckIncrease: 0, selfMaxHPIncrease: 500, targetMaxHPIncrease: 0, selfHPRecovery: 100, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: 0, isPlayerOnly: true}));
skillCards["rare"].push(new SkillCard({skillName: "腐食の霧", rarity: "rare", description: "装備をボロボロにする霧で、物理攻撃力を 100 下げる。", physicalDamageMultiplier: 0, magicalDamageMultiplier: 0, damageRange: 0, successProbability: 100, hpCost: 0, mpCost: 0, selfPhysicalAttackIncrease: 0, targetPhysicalAttackIncrease: -100, selfMagicalAttackIncrease: 0, targetMagicalAttackIncrease: 0, selfLuckIncrease: 0, targetLuckIncrease: 0, selfMaxHPIncrease: 0, targetMaxHPIncrease: 0, selfHPRecovery: 0, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: 0, isPlayerOnly: false}));
skillCards["common"].push(new SkillCard({skillName: "悪口", rarity: "common", description: "相手をけなして、やる気を削ぐ。\n魔法攻撃力を 100 下げる。", physicalDamageMultiplier: 0, magicalDamageMultiplier: 0, damageRange: 0, successProbability: 100, hpCost: 0, mpCost: 0, selfPhysicalAttackIncrease: 0, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 0, targetMagicalAttackIncrease: -100, selfLuckIncrease: 0, targetLuckIncrease: 0, selfMaxHPIncrease: 0, targetMaxHPIncrease: 0, selfHPRecovery: 0, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: 0, isPlayerOnly: false}));
skillCards["common"].push(new SkillCard({skillName: "四つ葉のクローバー", rarity: "common", description: "成功確率 50%\n足元で四つ葉のクローバーを探す。\n成功すると幸運度が 100 上がる。", physicalDamageMultiplier: 0, magicalDamageMultiplier: 0, damageRange: 0, successProbability: 50, hpCost: 0, mpCost: 0, selfPhysicalAttackIncrease: 0, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 0, targetMagicalAttackIncrease: 0, selfLuckIncrease: 100, targetLuckIncrease: 0, selfMaxHPIncrease: 0, targetMaxHPIncrease: 0, selfHPRecovery: 0, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: 0, isPlayerOnly: false}));
skillCards["uncommon"].push(new SkillCard({skillName: "幸運の兆し", rarity: "uncommon", description: "運が良くなる気がして、幸運度が 100 上がる。", physicalDamageMultiplier: 0, magicalDamageMultiplier: 0, damageRange: 0, successProbability: 100, hpCost: 0, mpCost: 0, selfPhysicalAttackIncrease: 0, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 0, targetMagicalAttackIncrease: 0, selfLuckIncrease: 100, targetLuckIncrease: 0, selfMaxHPIncrease: 0, targetMaxHPIncrease: 0, selfHPRecovery: 0, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: 0, isPlayerOnly: false}));
skillCards["rare"].push(new SkillCard({skillName: "大吉", rarity: "rare", description: "成功確率 25%\n神社のくじで最高の結果を引き当てようとする。\n成功すると幸運度を 500 上げる。", physicalDamageMultiplier: 0, magicalDamageMultiplier: 0, damageRange: 0, successProbability: 25, hpCost: 0, mpCost: 0, selfPhysicalAttackIncrease: 0, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 0, targetMagicalAttackIncrease: 0, selfLuckIncrease: 500, targetLuckIncrease: 0, selfMaxHPIncrease: 0, targetMaxHPIncrease: 0, selfHPRecovery: 0, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: 0, isPlayerOnly: false}));
skillCards["legendary"].push(new SkillCard({skillName: "因果律操作", rarity: "legendary", description: "「外れた」という事実を「当たった」ことに書き換え、不運を完全に無効化する。\n幸運度が 500 上がる。", physicalDamageMultiplier: 0, magicalDamageMultiplier: 0, damageRange: 0, successProbability: 100, hpCost: 0, mpCost: 0, selfPhysicalAttackIncrease: 0, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 0, targetMagicalAttackIncrease: 0, selfLuckIncrease: 500, targetLuckIncrease: 0, selfMaxHPIncrease: 0, targetMaxHPIncrease: 0, selfHPRecovery: 0, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: 0, isPlayerOnly: false}));
skillCards["common"].push(new SkillCard({skillName: "急所突き", rarity: "common", description: "成功確率 5%\n敵の隙を突き、首筋や心臓を正確に狙う。\n成功すれば大ダメージ。", physicalDamageMultiplier: 1000, magicalDamageMultiplier: 1000, damageRange: 25, successProbability: 5, hpCost: 0, mpCost: 0, selfPhysicalAttackIncrease: 0, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 0, targetMagicalAttackIncrease: 0, selfLuckIncrease: 0, targetLuckIncrease: 0, selfMaxHPIncrease: 0, targetMaxHPIncrease: 0, selfHPRecovery: 0, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: 0, isPlayerOnly: true}));
skillCards["uncommon"].push(new SkillCard({skillName: "毒の吹き矢", rarity: "uncommon", description: "成功確率 10%\n吹き矢で神経毒を送り込む。\n運が良ければ大ダメージ。", physicalDamageMultiplier: 1000, magicalDamageMultiplier: 1000, damageRange: 25, successProbability: 10, hpCost: 0, mpCost: 0, selfPhysicalAttackIncrease: 0, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 0, targetMagicalAttackIncrease: 0, selfLuckIncrease: 0, targetLuckIncrease: 0, selfMaxHPIncrease: 0, targetMaxHPIncrease: 0, selfHPRecovery: 0, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: 0, isPlayerOnly: true}));
skillCards["rare"].push(new SkillCard({skillName: "脳天割り", rarity: "rare", description: "成功確率 15%\n渾身の力で頭蓋を叩き割る。\nうまく当たれば大ダメージ。", physicalDamageMultiplier: 1000, magicalDamageMultiplier: 1000, damageRange: 25, successProbability: 15, hpCost: 0, mpCost: 0, selfPhysicalAttackIncrease: 0, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 0, targetMagicalAttackIncrease: 0, selfLuckIncrease: 0, targetLuckIncrease: 0, selfMaxHPIncrease: 0, targetMaxHPIncrease: 0, selfHPRecovery: 0, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: 0, isPlayerOnly: true}));
skillCards["epic"].push(new SkillCard({skillName: "延髄斬り", rarity: "epic", description: "成功確率 20%\n急所中の急所である延髄を捉える。\n完璧に決まれば大ダメージ。", physicalDamageMultiplier: 1000, magicalDamageMultiplier: 1000, damageRange: 25, successProbability: 20, hpCost: 0, mpCost: 0, selfPhysicalAttackIncrease: 0, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 0, targetMagicalAttackIncrease: 0, selfLuckIncrease: 0, targetLuckIncrease: 0, selfMaxHPIncrease: 0, targetMaxHPIncrease: 0, selfHPRecovery: 0, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: 0, isPlayerOnly: true}));
skillCards["legendary"].push(new SkillCard({skillName: "絶命の太刀", rarity: "legendary", description: "成功確率 25%\n生死の境を断つ神速の一閃。\n運が良ければ大ダメージ。", physicalDamageMultiplier: 1000, magicalDamageMultiplier: 1000, damageRange: 25, successProbability: 25, hpCost: 0, mpCost: 0, selfPhysicalAttackIncrease: 0, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 0, targetMagicalAttackIncrease: 0, selfLuckIncrease: 0, targetLuckIncrease: 0, selfMaxHPIncrease: 0, targetMaxHPIncrease: 0, selfHPRecovery: 0, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: 0, isPlayerOnly: true}));
skillCards["legendary"].push(new SkillCard({skillName: "超新星爆発", rarity: "legendary", description: "消費HP: 10,000\n体内で核融合を発生させ戦場ごと星を焼き尽くす。\n塵すら残らない。", physicalDamageMultiplier: 999999999, magicalDamageMultiplier: 0, damageRange: 99, successProbability: 100, hpCost: 10000, mpCost: 0, selfPhysicalAttackIncrease: 0, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 0, targetMagicalAttackIncrease: 0, selfLuckIncrease: 0, targetLuckIncrease: 0, selfMaxHPIncrease: 0, targetMaxHPIncrease: 0, selfHPRecovery: 0, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: 0, isPlayerOnly: true}));
skillCards["legendary"].push(new SkillCard({skillName: "天体激突", rarity: "legendary", description: "消費MP: 3,000\n衛星軌道上から巨大な隕石を呼び寄せ、一帯をクレーターに変える。\n物理法則を超えた終焉。", physicalDamageMultiplier: 0, magicalDamageMultiplier: 999999999, damageRange: 99, successProbability: 100, hpCost: 0, mpCost: 3000, selfPhysicalAttackIncrease: 0, targetPhysicalAttackIncrease: 0, selfMagicalAttackIncrease: 0, targetMagicalAttackIncrease: 0, selfLuckIncrease: 0, targetLuckIncrease: 0, selfMaxHPIncrease: 0, targetMaxHPIncrease: 0, selfHPRecovery: 0, targetHPRecovery: 0, selfMaxMPIncrease: 0, targetMaxMPIncrease: 0, selfMPRecovery: 0, targetMPRecovery: 0, isPlayerOnly: true}));

/**
 * 1枚のスキルカードを選択する関数
 * @param {number} luckMultiplier - 幸運係数の乗数
 * @returns {SkillCard} 選ばれた1枚のカード
 */
function selectSingleSkillCard(luck) {
    // ダイスを振る回数を決める
    const rollCount = Math.floor(luck / 100);
        
    let diceRoll = 0;

    // 指定された回数だけダイスを振って、一番良い目を採用
    for (let i = 0; i < rollCount; i++) {
        // 0〜100のダイスを振る
        diceRoll = Math.max(diceRoll, Math.random() * 100);
    }

    let chosenRarity = "";

    // レアリティ判定 (高い方から判定)
    if (diceRoll >= 99) {
        chosenRarity = "legendary";
    } else if (diceRoll >= 95) {
        chosenRarity = "epic";
    } else if (diceRoll >= 85) {
        chosenRarity = "rare";
    } else if (diceRoll >= 60) {
        chosenRarity = "uncommon";
    } else {
        chosenRarity = "common";
    }

    // 選ばれたレアリティの配列からランダムに1枚抽出
    const pool = skillCards[chosenRarity];
    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex];
}

/**
 * 4枚のスキルカードを選択する関数
 * @param {number} [luck=100] - 幸運度 (デフォルト100)
 * @returns {SkillCard[]} 選ばれた4枚のカード配列
 */
function selectSkillCards(luck = 100) {
    const selectedCards = [];

    for (let i = 0; i < 4; i++) {
        selectedCards.push(selectSingleSkillCard(luck));
    }

    return selectedCards;
}

/**
 * カードの内容を書き換える関数
 * @param {number} cardNumber - カード番号（1-4）
 * @param {SkillCard} skillCard - SkillCardインスタンス
 */
function updateCard(cardNumber, skillCard) {
    // カード要素を取得
    const cardElement = document.querySelector(`.card-item[data-card="${cardNumber}"]`);
    if (!cardElement) {
        console.error(`カード番号 ${cardNumber} が見つかりません`);
        return;
    }

    // SkillCardインスタンスをDOM要素に保存（カード選択時に読み取れるようにする）
    cardElement.skillCard = skillCard;

    // スキル名を更新
    const h4Element = cardElement.querySelector('.skill-name');
    if (h4Element) {
        h4Element.textContent = skillCard.skillName;
    }

    // レアリティインジケーターを更新
    const rarityIndicators = cardElement.querySelectorAll('.rarity-indicator');
    const rarityClassMap = {
        'common': 'rarity-common',
        'uncommon': 'rarity-uncommon',
        'rare': 'rarity-rare',
        'epic': 'rarity-epic',
        'legendary': 'rarity-legendary'
    };

    // すべてのレアリティインジケーターからactiveクラスを削除
    rarityIndicators.forEach(indicator => {
        indicator.classList.remove('active');
    });

    // 該当するレアリティのインジケーターにactiveクラスを追加
    const targetRarityClass = rarityClassMap[skillCard.rarity];
    if (targetRarityClass) {
        const targetIndicator = cardElement.querySelector(`.rarity-indicator.${targetRarityClass}`);
        if (targetIndicator) {
            targetIndicator.classList.add('active');
        }
    }

    // data-rarity属性を更新
    cardElement.setAttribute('data-rarity', skillCard.rarity);

    // 説明文を更新
    const descriptionElement = cardElement.querySelector('.skill-description');
    if (descriptionElement) {
        descriptionElement.textContent = skillCard.description;
    }
}

/**
 * カードをリフレッシュする関数
 */
function refreshSkillCards() {
    const luck = (typeof player !== 'undefined' && player) ? player.luck : 100;
    const selectedCards = selectSkillCards(luck);
    for (let i = 0; i < 4; i++) {
        updateCard(i + 1, selectedCards[i]);
    }
}

/**
 * キャラクターカードの内容を書き換える関数
 * @param {string} cardClass - 書き換えるカードのclass名（例: "character-card-player" または "character-card-enemy"）
 * @param {Character} character - Characterインスタンス
 */
function updateCharacterCard(cardClass, character) {
    // カード要素を取得
    const cardElement = document.querySelector(`.${cardClass}`);
    if (!cardElement) {
        console.error(`カードクラス "${cardClass}" が見つかりません`);
        return;
    }

    // キャラクター画像を更新
    const imageElement = cardElement.querySelector('.character-image');
    if (imageElement) {
        imageElement.src = character.imageFileName;
    }

    // キャラクター名を更新
    const nameElement = cardElement.querySelector('.character-name');
    if (nameElement) {
        nameElement.textContent = character.name;
    }

    // HPテキストとHPバーを更新
    const hpTextElement = cardElement.querySelector('.character-hp-text');
    if (hpTextElement) {
        const formattedCurrentHP = character.currentHP.toLocaleString();
        const formattedMaxHP = character.maxHP.toLocaleString();
        hpTextElement.textContent = `${formattedCurrentHP} / ${formattedMaxHP}`;
    }

    const hpFillElement = cardElement.querySelector('.character-hp-fill');
    if (hpFillElement) {
        const hpPercentage = (character.currentHP / character.maxHP) * 100;
        hpFillElement.style.width = `${hpPercentage}%`;
    }

    // MPテキストとMPバーを更新
    const mpTextElement = cardElement.querySelector('.character-mp-text');
    if (mpTextElement) {
        const formattedCurrentMP = character.currentMP.toLocaleString();
        const formattedMaxMP = character.maxMP.toLocaleString();
        mpTextElement.textContent = `${formattedCurrentMP} / ${formattedMaxMP}`;
    }

    const mpFillElement = cardElement.querySelector('.character-mp-fill');
    if (mpFillElement) {
        const mpPercentage = (character.currentMP / character.maxMP) * 100;
        mpFillElement.style.width = `${mpPercentage}%`;
    }

    // 物理攻撃力を更新
    const physicalAttackElement = cardElement.querySelector('.character-physical-attack');
    if (physicalAttackElement) {
        physicalAttackElement.textContent = character.physicalAttack.toLocaleString();
    }

    // 魔法攻撃力を更新
    const magicalAttackElement = cardElement.querySelector('.character-magical-attack');
    if (magicalAttackElement) {
        magicalAttackElement.textContent = character.magicalAttack.toLocaleString();
    }

    // 幸運度を更新
    const luckElement = cardElement.querySelector('.character-luck');
    if (luckElement) {
        luckElement.textContent = character.luck.toLocaleString();
    }
}

// ターン数管理
// ターン数管理
let currentTurn = 1;

// リロール回数管理（初期3回）
let rerollCount = 3;

/**
 * リロール表示およびボタンの状態を更新する関数
 */
function updateRerollDisplay() {
    const rerollBtn = document.getElementById('rerollBtn');
    const badge = document.getElementById('rerollCountBadge');
    if (badge) {
        badge.textContent = `残り ${rerollCount}回`;
    }
    if (rerollBtn) {
        rerollBtn.disabled = (rerollCount <= 0 || isTurnProcessing || player.currentHP <= 0 || enemy.currentHP <= 0);
    }
}

/**
 * リロールを実行する関数
 */
function handleReroll() {
    if (rerollCount <= 0) return;
    if (isTurnProcessing) return;
    if (player.currentHP <= 0 || enemy.currentHP <= 0) return;

    rerollCount--;
    updateRerollDisplay();

    // カードを再抽選
    refreshSkillCards();

    // カードにシャッフル風のアニメーションを付与
    if (!isSkipAnimation) {
        const cardElements = document.querySelectorAll('.card-item');
        cardElements.forEach(c => {
            c.classList.remove('fade-in');
            void c.offsetWidth;
            c.classList.add('fade-in');
            c.addEventListener('animationend', () => {
                c.classList.remove('fade-in');
            }, { once: true });
        });
    }

    addBattleLogMessage(`\n\n【リロール】手札のスキルカードを引き直した！ (残り: ${rerollCount}回)`);
    flashBattleLog();
}

/**
 * ターン数を増やす関数
 */
function incrementTurn() {
    currentTurn++;
    updateTurnDisplay();

    // 10ターンごとにリロール回数を1回回復
    if (currentTurn % 10 === 0) {
        rerollCount++;
        addBattleLogMessage(`\n\n【リロール回復】${currentTurn}ターンに到達！リロール回数が1回回復した！ (残り: ${rerollCount}回)`);
        flashBattleLog();
        updateRerollDisplay();
    }
}

/**
 * ターン数の表示を更新する関数
 */
function updateTurnDisplay() {
    const turnCountElement = document.getElementById('turnCount');
    if (turnCountElement) {
        turnCountElement.textContent = currentTurn;
    }
}

/**
 * バトルログにメッセージを追加する関数
 * @param {string} message - 追加するメッセージ
 */
function addBattleLogMessage(message) {
    const battleLog = document.getElementById('battleLog');
    battleLog.value += message;
    battleLog.scrollTop = battleLog.scrollHeight;
}

/**
 * ゲーム終了処理を行う関数
 * @param {string} result - ゲーム結果 ("win" または "lose")
 */
function endGame(result) {
    // 負けたキャラクターのカードを暗くする
    if (result === "lose") {
        // プレイヤーが負けた場合（左側のカードを暗くする）
        addBattleLogMessage("\n世界は暗黒に包まれた...");
        const playerCard = document.querySelector('.character-card-player');
        if (playerCard) {
            playerCard.classList.add('defeated');
        }
    } else if (result === "win") {
        // 敵が負けた場合（右側のカードを暗くする）
        addBattleLogMessage("\n世界は光に包まれた...");
        const enemyCard = document.querySelector('.character-card-enemy');
        if (enemyCard) {
            enemyCard.classList.add('defeated');
        }
    }

    // すべてのスキルカードを選択不可能にする
    const cardItems = document.querySelectorAll('.card-item');
    cardItems.forEach(card => {
        card.classList.add('disabled');
    });

    updateRerollDisplay();
}

// カード選択の処理
const cardItems = document.querySelectorAll('.card-item');
let isTurnProcessing = false;

cardItems.forEach(card => {
    card.addEventListener('click', async () => {
        // すでにターン処理中、またはゲーム終了済みの場合は無視
        if (isTurnProcessing) return;
        if (player.currentHP <= 0 || enemy.currentHP <= 0) return;

        isTurnProcessing = true;
        updateRerollDisplay();

        // 全カードをクリック不可にし、選択したカードを強調
        cardItems.forEach(c => {
            c.classList.add('processing');
            c.classList.remove('selected');
            c.classList.remove('border-blue-500');
            c.classList.add('border-gray-700');
        });
        card.classList.add('selected', 'border-blue-500');
        if (!isSkipAnimation) {
            card.classList.add('casting');
        }
        card.classList.remove('border-gray-700');

        // クリックされたカードのSkillCardインスタンスを取得
        const skillCard = card.skillCard;

        // === 1. プレイヤーの行動 ===
        const enemyDefeated = await skillCard.activate(player);

        card.classList.remove('casting');

        // 敵が倒れた場合
        if (enemyDefeated || enemy.currentHP <= 0) {
            endGame("win");
            isTurnProcessing = false;
            updateRerollDisplay();
            return;
        }

        // プレイヤー行動演出後、エネミー行動までのウェイト（間）
        await sleep(900);

        // === 2. エネミーの行動（エネミーが生存している場合） ===
        if (enemy.currentHP > 0) {
            let enemySkillCard;
            while (true) {
                enemySkillCard = selectSingleSkillCard(enemy.luck);
                if (!enemySkillCard.isPlayerOnly) {
                    break;
                }
                // プレイヤー専用のカードが選ばれた場合、再度カードを選び直す
            }

            // 敵のスキルカードを使用
            const playerDefeated = await enemySkillCard.activate(enemy);

            // プレイヤーが倒れた場合
            if (playerDefeated || player.currentHP <= 0) {
                endGame("lose");
                isTurnProcessing = false;
                updateRerollDisplay();
                return;
            }
        }

        // === 3. ターン終了処理 ===
        await sleep(500);

        // 新しいカードを配る
        const selectedCards = selectSkillCards(player.luck);
        for (let i = 0; i < 4; i++) {
            updateCard(i + 1, selectedCards[i]);
        }

        // 選択状態とprocessingクラスの解除
        cardItems.forEach(c => {
            c.classList.remove('processing');
            c.classList.remove('selected');
            c.classList.remove('border-blue-500');
            c.classList.add('border-gray-700');
        });

        // ターン数を増やす
        incrementTurn();

        isTurnProcessing = false;
        updateRerollDisplay();
    });
});

// モーダルダイアログの表示・非表示処理および初期化
document.addEventListener('DOMContentLoaded', () => {
    // 初期表示アニメーション完了後にfade-inクラスを除去（後のアニメーション解除時の再フェード誤動作防止）
    const battleContainer = document.getElementById('battleContainer');
    if (battleContainer) {
        battleContainer.addEventListener('animationend', (e) => {
            if (e.target === battleContainer) {
                battleContainer.classList.remove('fade-in');
            }
        }, { once: true });
        setTimeout(() => {
            battleContainer.classList.remove('fade-in');
        }, 1000);
    }

    updateCharacterCard('character-card-player', player);
    updateCharacterCard('character-card-enemy', enemy);

    // スキルカードを更新
    refreshSkillCards();
    
    // 初期ターン数の表示を更新
    updateTurnDisplay();

    // リロール初期化
    updateRerollDisplay();
    const rerollBtn = document.getElementById('rerollBtn');
    if (rerollBtn) {
        rerollBtn.addEventListener('click', handleReroll);
    }

    // 演出スキップトグルの初期化
    const skipToggle = document.getElementById('skipAnimationToggle');
    if (skipToggle) {
        skipToggle.checked = isSkipAnimation;
        skipToggle.addEventListener('change', (e) => {
            isSkipAnimation = e.target.checked;
            localStorage.setItem('rpg_skip_animation', isSkipAnimation);
        });
    }

    const modal = document.getElementById('instructionModal');
    const closeBtn = document.getElementById('closeModalBtn');

    // ページ読み込み時にモーダルを表示
    if (modal) {
        modal.classList.add('show');
    }

    // 閉じるボタンをクリックしたときにモーダルを閉じる
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (modal) {
                modal.classList.remove('show');
            }
        });
    }

    // モーダルの背景（オーバーレイ）をクリックしたときも閉じる
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    }
});
