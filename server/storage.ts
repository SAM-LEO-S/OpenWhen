import { verses, userPreferences, type Verse, type InsertVerse, type UserPreferences, type InsertUserPreferences, type EmotionCategory } from "@shared/schema";

export interface IStorage {
  // Verse operations
  getVersesByEmotion(emotion: EmotionCategory): Promise<Verse[]>;
  addVerse(verse: InsertVerse): Promise<Verse>;
  getRandomVerseByEmotion(emotion: EmotionCategory): Promise<Verse | undefined>;
  
  // User preferences
  getUserPreferences(): Promise<UserPreferences | undefined>;
  updateUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences>;
}

export class MemStorage implements IStorage {
  private verses: Map<number, Verse>;
  private preferences: UserPreferences | undefined;
  private currentVerseId: number;
  private currentPreferenceId: number;
  private recentVerses: Map<EmotionCategory, number[]>; // Track recent verse IDs per emotion

  constructor() {
    this.verses = new Map();
    this.currentVerseId = 1;
    this.currentPreferenceId = 1;
    this.recentVerses = new Map();
    
    // Initialize with some default verses for each emotion
    this.initializeDefaultVerses();
  }

  private initializeDefaultVerses() {
    const defaultVerses: InsertVerse[] = [
      // ANXIOUS - 8 verses
      {
        emotion: "anxious",
        text: "Therefore do not worry about tomorrow, for tomorrow will worry about itself. Each day has enough trouble of its own.",
        reference: "Matthew 6:34",
        personalMessage: "Your anxious thoughts don't define your future. God holds tomorrow in His hands, and He invites you to rest in His peace today. Take a deep breath and trust in His perfect timing."
      },
      {
        emotion: "anxious",
        text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.",
        reference: "Philippians 4:6",
        personalMessage: "Anxiety is not a sign of weak faith. It's an invitation to bring your concerns to the One who cares for you completely. Pour out your heart to Him."
      },
      {
        emotion: "anxious",
        text: "Cast your burden on the Lord, and he will sustain you; he will never permit the righteous to be moved.",
        reference: "Psalm 55:22",
        personalMessage: "You don't have to carry your worries alone. God is strong enough to hold them all. Let Him carry what's too heavy for you."
      },
      {
        emotion: "anxious",
        text: "Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.",
        reference: "John 14:27",
        personalMessage: "Jesus offers you a peace that the world cannot give or take away. Rest in His presence and let His peace fill your heart."
      },
      {
        emotion: "anxious",
        text: "Let not your hearts be troubled, neither let them be afraid.",
        reference: "John 14:27",
        personalMessage: "When anxiety creeps in, remember that Jesus has overcome the world. His peace is available to you right now."
      },
      {
        emotion: "anxious",
        text: "In peace I will lie down and sleep, for you alone, Lord, make me dwell in safety.",
        reference: "Psalm 4:8",
        personalMessage: "Even in your anxious moments, God provides safety and rest. Trust Him to watch over you as you sleep."
      },
      {
        emotion: "anxious",
        text: "When I am afraid, I put my trust in you.",
        reference: "Psalm 56:3",
        personalMessage: "Fear and anxiety don't have to control you. Choose to trust in God's faithfulness instead."
      },
      {
        emotion: "anxious",
        text: "The Lord is my light and my salvation—whom shall I fear? The Lord is the stronghold of my life—of whom shall I be afraid?",
        reference: "Psalm 27:1",
        personalMessage: "With God as your light and salvation, there's nothing to fear. He is your stronghold and protection."
      },

      // HAPPY - 8 verses
      {
        emotion: "happy",
        text: "This is the day that the Lord has made; let us rejoice and be glad in it.",
        reference: "Psalm 118:24",
        personalMessage: "Your joy is a gift from God. Let it shine brightly and be a blessing to others around you today. Share this happiness with those who need it."
      },
      {
        emotion: "happy",
        text: "Rejoice in the Lord always. I will say it again: Rejoice!",
        reference: "Philippians 4:4",
        personalMessage: "Your happiness is not dependent on circumstances but on the unchanging love of God. Let your joy overflow to others."
      },
      {
        emotion: "happy",
        text: "The joy of the Lord is your strength.",
        reference: "Nehemiah 8:10",
        personalMessage: "God's joy is a powerful force that can sustain you through any challenge. Let His joy be your foundation."
      },
      {
        emotion: "happy",
        text: "Light is sown for the righteous, and joy for the upright in heart.",
        reference: "Psalm 97:11",
        personalMessage: "Your happiness is a reflection of God's goodness in your life. Celebrate His blessings with gratitude."
      },
      {
        emotion: "happy",
        text: "Shout for joy to God, all the earth!",
        reference: "Psalm 66:1",
        personalMessage: "Your happiness is meant to be shared. Let your joy be contagious and bring light to those around you."
      },
      {
        emotion: "happy",
        text: "A cheerful heart is good medicine, but a crushed spirit dries up the bones.",
        reference: "Proverbs 17:22",
        personalMessage: "Your happiness is not just good for you—it's healing for your soul and a blessing to others."
      },
      {
        emotion: "happy",
        text: "I will be glad and rejoice in you; I will sing the praises of your name, O Most High.",
        reference: "Psalm 9:2",
        personalMessage: "Your happiness is a form of worship. Rejoice in God's goodness and let your joy be a song of praise."
      },
      {
        emotion: "happy",
        text: "Blessed are those who hunger and thirst for righteousness, for they will be filled.",
        reference: "Matthew 5:6",
        personalMessage: "True happiness comes from seeking God's righteousness. Your joy is a sign of His blessing in your life."
      },

      // SAD - 8 verses
      {
        emotion: "sad",
        text: "The Lord is close to the brokenhearted and saves those who are crushed in spirit.",
        reference: "Psalm 34:18",
        personalMessage: "Your tears are precious to God. He sees every sorrow and collects every tear. You are not alone in your pain, and healing will come in His perfect time."
      },
      {
        emotion: "sad",
        text: "Blessed are those who mourn, for they will be comforted.",
        reference: "Matthew 5:4",
        personalMessage: "Your sadness is not a sign of weakness. God promises to comfort those who grieve. He is with you in your pain."
      },
      {
        emotion: "sad",
        text: "He heals the brokenhearted and binds up their wounds.",
        reference: "Psalm 147:3",
        personalMessage: "God is the great healer of broken hearts. Trust Him to mend what's broken and restore your joy."
      },
      {
        emotion: "sad",
        text: "Weeping may stay for the night, but rejoicing comes in the morning.",
        reference: "Psalm 30:5",
        personalMessage: "Your sadness won't last forever. God promises that joy will come again. Hold on to hope."
      },
      {
        emotion: "sad",
        text: "Come to me, all you who are weary and burdened, and I will give you rest.",
        reference: "Matthew 11:28",
        personalMessage: "Jesus invites you to find rest in Him. Bring your sadness and He will give you peace and comfort."
      },
      {
        emotion: "sad",
        text: "The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul.",
        reference: "Psalm 23:1-3",
        personalMessage: "Even in your sadness, God is leading you to places of rest and refreshment. Let Him restore your soul."
      },
      {
        emotion: "sad",
        text: "Cast your cares on the Lord and he will sustain you; he will never let the righteous be shaken.",
        reference: "Psalm 55:22",
        personalMessage: "You don't have to carry your sadness alone. God will sustain you and keep you steady through this difficult time."
      },
      {
        emotion: "sad",
        text: "I have told you these things, so that in me you may have peace. In this world you will have trouble. But take heart! I have overcome the world.",
        reference: "John 16:33",
        personalMessage: "Jesus understands your sadness and offers you His peace. He has overcome everything that causes pain."
      },

      // GRATEFUL - 8 verses
      {
        emotion: "grateful",
        text: "Give thanks to the Lord, for he is good; his love endures forever.",
        reference: "Psalm 107:1",
        personalMessage: "Gratitude transforms our perspective and opens our hearts to see God's goodness in every circumstance. Your thankful heart is a beautiful offering to Him."
      },
      {
        emotion: "grateful",
        text: "In everything give thanks; for this is the will of God in Christ Jesus for you.",
        reference: "1 Thessalonians 5:18",
        personalMessage: "Gratitude is a choice that brings peace and contentment. Find something to be thankful for in every situation."
      },
      {
        emotion: "grateful",
        text: "I will give thanks to you, Lord, with all my heart; I will tell of all your wonderful deeds.",
        reference: "Psalm 9:1",
        personalMessage: "Your gratitude is a testimony to God's faithfulness. Share your thankfulness with others."
      },
      {
        emotion: "grateful",
        text: "Enter his gates with thanksgiving and his courts with praise; give thanks to him and praise his name.",
        reference: "Psalm 100:4",
        personalMessage: "Approach God with a heart full of gratitude. Your thankfulness opens the door to His presence."
      },
      {
        emotion: "grateful",
        text: "Oh give thanks to the Lord, for he is good, for his steadfast love endures forever!",
        reference: "Psalm 107:1",
        personalMessage: "Your gratitude acknowledges God's goodness and His never-ending love for you."
      },
      {
        emotion: "grateful",
        text: "I will praise you, Lord, with all my heart; I will tell of all the marvelous things you have done.",
        reference: "Psalm 9:1",
        personalMessage: "Your gratitude is a form of praise. Celebrate all the wonderful things God has done in your life."
      },
      {
        emotion: "grateful",
        text: "Let them give thanks to the Lord for his unfailing love and his wonderful deeds for mankind.",
        reference: "Psalm 107:8",
        personalMessage: "Your gratitude recognizes God's unfailing love and the wonderful things He does for you every day."
      },
      {
        emotion: "grateful",
        text: "Give thanks in all circumstances; for this is God's will for you in Christ Jesus.",
        reference: "1 Thessalonians 5:18",
        personalMessage: "Gratitude is God's will for your life. It brings joy and peace in every circumstance."
      },

      // STRENGTH - 8 verses
      {
        emotion: "strength",
        text: "I can do all this through him who gives me strength.",
        reference: "Philippians 4:13",
        personalMessage: "Your strength doesn't come from within alone - it flows from the infinite power of God who loves you. You are capable of more than you know because He is with you."
      },
      {
        emotion: "strength",
        text: "The Lord is my strength and my shield; my heart trusts in him, and he helps me.",
        reference: "Psalm 28:7",
        personalMessage: "God is your source of strength and protection. Trust in Him and He will help you overcome any challenge."
      },
      {
        emotion: "strength",
        text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.",
        reference: "Isaiah 40:31",
        personalMessage: "When you place your hope in God, He renews your strength. You can endure and overcome because He empowers you."
      },
      {
        emotion: "strength",
        text: "The Lord gives strength to his people; the Lord blesses his people with peace.",
        reference: "Psalm 29:11",
        personalMessage: "God's strength comes with His peace. You don't have to be strong on your own - He provides both."
      },
      {
        emotion: "strength",
        text: "My flesh and my heart may fail, but God is the strength of my heart and my portion forever.",
        reference: "Psalm 73:26",
        personalMessage: "Even when you feel weak, God is your strength. He is your portion and will sustain you forever."
      },
      {
        emotion: "strength",
        text: "The Lord is my rock, my fortress and my deliverer; my God is my rock, in whom I take refuge, my shield and the horn of my salvation, my stronghold.",
        reference: "Psalm 18:2",
        personalMessage: "God is your unshakeable foundation. In Him you find strength, protection, and deliverance."
      },
      {
        emotion: "strength",
        text: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
        reference: "Joshua 1:9",
        personalMessage: "God's presence gives you strength and courage. He is with you wherever you go, so you have nothing to fear."
      },
      {
        emotion: "strength",
        text: "Finally, be strong in the Lord and in his mighty power.",
        reference: "Ephesians 6:10",
        personalMessage: "Your strength comes from the Lord's mighty power. Draw on His strength, not your own."
      },

      // LONELY - 8 verses
      {
        emotion: "lonely",
        text: "Never will I leave you; never will I forsake you.",
        reference: "Hebrews 13:5",
        personalMessage: "Even when you feel completely alone, you are held in the arms of a God who will never abandon you. His presence is constant, His love unwavering."
      },
      {
        emotion: "lonely",
        text: "The Lord himself goes before you and will be with you; he will never leave you nor forsake you. Do not be afraid; do not be discouraged.",
        reference: "Deuteronomy 31:8",
        personalMessage: "God goes before you and walks beside you. You are never truly alone, even when it feels that way."
      },
      {
        emotion: "lonely",
        text: "Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.",
        reference: "Psalm 23:4",
        personalMessage: "In your loneliest moments, God is your shepherd, guiding and comforting you through the darkness."
      },
      {
        emotion: "lonely",
        text: "Come near to God and he will come near to you.",
        reference: "James 4:8",
        personalMessage: "When you feel lonely, draw near to God. He promises to draw near to you in return."
      },
      {
        emotion: "lonely",
        text: "The Lord is near to all who call on him in truth.",
        reference: "Psalm 145:18",
        personalMessage: "God is close to you when you call on Him. His presence is just a prayer away."
      },
      {
        emotion: "lonely",
        text: "I am with you always, to the very end of the age.",
        reference: "Matthew 28:20",
        personalMessage: "Jesus promises to be with you always. You are never truly alone because He is always present."
      },
      {
        emotion: "lonely",
        text: "Fear not, for I am with you; be not dismayed, for I am your God; I will strengthen you, I will help you.",
        reference: "Isaiah 41:10",
        personalMessage: "God is with you and will strengthen you. You don't have to be afraid or discouraged."
      },
      {
        emotion: "lonely",
        text: "The Lord is my shepherd, I shall not want. He makes me lie down in green pastures, he leads me beside quiet waters.",
        reference: "Psalm 23:1-2",
        personalMessage: "God is your shepherd who provides everything you need. He leads you to places of rest and peace."
      },

      // GUIDANCE - 8 verses
      {
        emotion: "guidance",
        text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
        reference: "Proverbs 3:5-6",
        personalMessage: "When the path ahead seems unclear, remember that God sees the entire journey. Trust His guidance even when you can't see the next step clearly."
      },
      {
        emotion: "guidance",
        text: "Your word is a lamp for my feet, a light on my path.",
        reference: "Psalm 119:105",
        personalMessage: "God's Word illuminates your path, showing you the way forward even in the darkest times."
      },
      {
        emotion: "guidance",
        text: "I will instruct you and teach you in the way you should go; I will counsel you with my loving eye on you.",
        reference: "Psalm 32:8",
        personalMessage: "God promises to guide you with His loving care. Trust His instruction and teaching."
      },
      {
        emotion: "guidance",
        text: "Whether you turn to the right or to the left, your ears will hear a voice behind you, saying, 'This is the way; walk in it.'",
        reference: "Isaiah 30:21",
        personalMessage: "God's guidance is clear and constant. Listen for His voice directing your steps."
      },
      {
        emotion: "guidance",
        text: "The Lord will guide you always; he will satisfy your needs in a sun-scorched land and will strengthen your frame.",
        reference: "Isaiah 58:11",
        personalMessage: "God's guidance is constant and He will provide for your needs even in difficult times."
      },
      {
        emotion: "guidance",
        text: "Show me your ways, Lord, teach me your paths. Guide me in your truth and teach me.",
        reference: "Psalm 25:4-5",
        personalMessage: "Ask God to show you His ways and teach you His paths. He is ready to guide you in truth."
      },
      {
        emotion: "guidance",
        text: "For this God is our God for ever and ever; he will be our guide even to the end.",
        reference: "Psalm 48:14",
        personalMessage: "God will be your guide forever. His guidance doesn't end - it continues throughout your life."
      },
      {
        emotion: "guidance",
        text: "The Lord is my shepherd, I lack nothing. He guides me along the right paths for his name's sake.",
        reference: "Psalm 23:1,3",
        personalMessage: "God guides you along the right paths. Trust Him to lead you in the way that honors His name."
      },

      // ANGRY - 8 verses
      {
        emotion: "angry",
        text: "In your anger do not sin: Do not let the sun go down while you are still angry.",
        reference: "Ephesians 4:26",
        personalMessage: "Your anger is valid, but it doesn't have to control you. God offers you peace and wisdom to handle difficult emotions in healthy ways."
      },
      {
        emotion: "angry",
        text: "Whoever is patient has great understanding, but one who is quick-tempered displays folly.",
        reference: "Proverbs 14:29",
        personalMessage: "Patience brings wisdom and understanding. God can help you respond with grace instead of anger."
      },
      {
        emotion: "angry",
        text: "Refrain from anger and turn from wrath; do not fret—it leads only to evil.",
        reference: "Psalm 37:8",
        personalMessage: "God invites you to let go of anger and trust Him to handle what's causing your frustration."
      },
      {
        emotion: "angry",
        text: "A gentle answer turns away wrath, but a harsh word stirs up anger.",
        reference: "Proverbs 15:1",
        personalMessage: "God can help you respond with gentleness even when you're angry. His peace can calm your heart."
      },
      {
        emotion: "angry",
        text: "But now you must also rid yourselves of all such things as these: anger, rage, malice, slander.",
        reference: "Colossians 3:8",
        personalMessage: "God helps you let go of anger and replace it with His peace and love."
      },
      {
        emotion: "angry",
        text: "My dear brothers and sisters, take note of this: Everyone should be quick to listen, slow to speak and slow to become angry.",
        reference: "James 1:19",
        personalMessage: "God's wisdom helps you listen more, speak less, and control your anger."
      },
      {
        emotion: "angry",
        text: "The Lord is gracious and compassionate, slow to anger and rich in love.",
        reference: "Psalm 145:8",
        personalMessage: "Follow God's example - be slow to anger and rich in love and compassion."
      },
      {
        emotion: "angry",
        text: "Cease from anger, and forsake wrath; Do not fret—it only causes harm.",
        reference: "Psalm 37:8",
        personalMessage: "Let go of anger and wrath. God's peace is better for your heart and mind."
      },

      // ANYTHING - 8 verses
      {
        emotion: "anything",
        text: "Cast all your anxiety on him because he cares for you.",
        reference: "1 Peter 5:7",
        personalMessage: "Every emotion you feel is valid. God sees your struggles and walks with you through every season of life. You are loved, you are valued, and you are never forgotten."
      },
      {
        emotion: "anything",
        text: "The Lord is my shepherd, I lack nothing.",
        reference: "Psalm 23:1",
        personalMessage: "God provides everything you need. Trust in His care and provision for your life."
      },
      {
        emotion: "anything",
        text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.",
        reference: "Jeremiah 29:11",
        personalMessage: "God has good plans for your life. Trust in His purpose and timing for everything."
      },
      {
        emotion: "anything",
        text: "Come to me, all you who are weary and burdened, and I will give you rest.",
        reference: "Matthew 11:28",
        personalMessage: "Jesus invites you to find rest in Him. Bring your burdens and He will give you peace."
      },
      {
        emotion: "anything",
        text: "The Lord is my light and my salvation—whom shall I fear? The Lord is the stronghold of my life—of whom shall I be afraid?",
        reference: "Psalm 27:1",
        personalMessage: "With God as your light and salvation, there's nothing to fear. He is your stronghold and protection."
      },
      {
        emotion: "anything",
        text: "I can do all things through Christ who strengthens me.",
        reference: "Philippians 4:13",
        personalMessage: "You are capable of more than you know because Christ gives you strength."
      },
      {
        emotion: "anything",
        text: "The Lord is near to all who call on him in truth.",
        reference: "Psalm 145:18",
        personalMessage: "God is close to you when you call on Him. His presence is just a prayer away."
      },
      {
        emotion: "anything",
        text: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
        reference: "Joshua 1:9",
        personalMessage: "God's presence gives you strength and courage. He is with you wherever you go."
      }
    ];

    defaultVerses.forEach(verse => {
      const newVerse: Verse = {
        ...verse,
        id: this.currentVerseId++,
        createdAt: new Date()
      };
      this.verses.set(newVerse.id, newVerse);
    });
  }

  async getVersesByEmotion(emotion: EmotionCategory): Promise<Verse[]> {
    return Array.from(this.verses.values()).filter(verse => verse.emotion === emotion);
  }

  async addVerse(insertVerse: InsertVerse): Promise<Verse> {
    const verse: Verse = {
      ...insertVerse,
      id: this.currentVerseId++,
      createdAt: new Date()
    };
    this.verses.set(verse.id, verse);
    return verse;
  }

  async getRandomVerseByEmotion(emotion: EmotionCategory): Promise<Verse | undefined> {
    const emotionVerses = await this.getVersesByEmotion(emotion);
    if (emotionVerses.length === 0) return undefined;
    
    // Get recent verses for this emotion
    const recentVerseIds = this.recentVerses.get(emotion) || [];
    
    // Filter out recently shown verses (last 3)
    const availableVerses = emotionVerses.filter(verse => 
      !recentVerseIds.includes(verse.id)
    );
    
    // If all verses have been shown recently, reset the recent list
    const versesToChooseFrom = availableVerses.length > 0 ? availableVerses : emotionVerses;
    
    // Use proper random selection with Math.random()
    const randomIndex = Math.floor(Math.random() * versesToChooseFrom.length);
    const selectedVerse = versesToChooseFrom[randomIndex];
    
    // Update recent verses list (keep last 3)
    const updatedRecentIds = [...recentVerseIds, selectedVerse.id].slice(-3);
    this.recentVerses.set(emotion, updatedRecentIds);
    
    console.log(`[Storage] Emotion: ${emotion}, Total verses: ${emotionVerses.length}, Available: ${availableVerses.length}, Recent: [${recentVerseIds.join(',')}], Selected: ${selectedVerse.reference}`);
    
    return selectedVerse;
  }

  async getUserPreferences(): Promise<UserPreferences | undefined> {
    return this.preferences;
  }

  async updateUserPreferences(insertPreferences: InsertUserPreferences): Promise<UserPreferences> {
    const preferences: UserPreferences = {
      id: this.preferences?.id || this.currentPreferenceId++,
      theme: insertPreferences.theme || "light",
      lastUpdated: new Date()
    };
    this.preferences = preferences;
    return preferences;
  }
}

export const storage = new MemStorage();
