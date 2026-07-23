// ============================================
// Storm-MD v2.0 — lib/tools.js
// UTILITY TOOLS & HELPERS
// ============================================

const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

// ==========================================
// TEXT UTILITIES
// ==========================================
const textTools = {
  // Reverse text
  reverse(str) {
    return str.split('').reverse().join('');
  },
  
  // Word count
  wordCount(str) {
    return {
      words: str.trim().split(/\s+/).filter(w => w.length > 0).length,
      characters: str.length,
      charactersNoSpace: str.replace(/\s/g, '').length,
      lines: str.split('\n').length
    };
  },
  
  // Mock text (sPoNgEbOb MoCk)
  mockText(str) {
    return str.split('').map((char, i) => 
      i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
    ).join('');
  },
  
  // Bold text (Unicode)
  boldText(str) {
    const boldMap = {
      'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 'f': '𝐟',
      'g': '𝐠', 'h': '𝐡', 'i': '𝐢', 'j': '𝐣', 'k': '𝐤', 'l': '𝐥',
      'm': '𝐦', 'n': '𝐧', 'o': '𝐨', 'p': '𝐩', 'q': '𝐪', 'r': '𝐫',
      's': '𝐬', 't': '𝐭', 'u': '𝐮', 'v': '𝐯', 'w': '𝐰', 'x': '𝐱',
      'y': '𝐲', 'z': '𝐳',
      'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅',
      'G': '𝐆', 'H': '𝐇', 'I': '𝐈', 'J': '𝐉', 'K': '𝐊', 'L': '𝐋',
      'M': '𝐌', 'N': '𝐍', 'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑',
      'S': '𝐒', 'T': '𝐓', 'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗',
      'Y': '𝐘', 'Z': '𝐙',
      '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒',
      '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
    };
    return str.split('').map(c => boldMap[c] || c).join('');
  },
  
  // Italic text
  italicText(str) {
    const italicMap = {
      'a': '𝑎', 'b': '𝑏', 'c': '𝑐', 'd': '𝑑', 'e': '𝑒', 'f': '𝑓',
      'g': '𝑔', 'h': 'ℎ', 'i': '𝑖', 'j': '𝑗', 'k': '𝑘', 'l': '𝑙',
      'm': '𝑚', 'n': '𝑛', 'o': '𝑜', 'p': '𝑝', 'q': '𝑞', 'r': '𝑟',
      's': '𝑠', 't': '𝑡', 'u': '𝑢', 'v': '𝑣', 'w': '𝑤', 'x': '𝑥',
      'y': '𝑦', 'z': '𝑧',
      'A': '𝐴', 'B': '𝐵', 'C': '𝐶', 'D': '𝐷', 'E': '𝐸', 'F': '𝐹',
      'G': '𝐺', 'H': '𝐻', 'I': '𝐼', 'J': '𝐽', 'K': '𝐾', 'L': '𝐿',
      'M': '𝑀', 'N': '𝑁', 'O': '𝑂', 'P': '𝑃', 'Q': '𝑄', 'R': '𝑅',
      'S': '𝑆', 'T': '𝑇', 'U': '𝑈', 'V': '𝑉', 'W': '𝑊', 'X': '𝑋',
      'Y': '𝑌', 'Z': '𝑍'
    };
    return str.split('').map(c => italicMap[c] || c).join('');
  },
  
  // Base64 encode/decode
  base64Encode(str) {
    return Buffer.from(str).toString('base64');
  },
  
  base64Decode(str) {
    return Buffer.from(str, 'base64').toString('utf-8');
  },
  
  // Generate hash
  hashText(str, algo = 'md5') {
    const crypto = require('crypto');
    return crypto.createHash(algo).update(str).digest('hex');
  },
  
  // Generate random string
  randomString(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },
  
  // Slugify text
  slugify(str) {
    return str.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  }
};

// ==========================================
// NUMBER / MATH TOOLS
// ==========================================
const mathTools = {
  // Calculator (safe eval)
  calculate(expression) {
    // Remove dangerous characters
    const sanitized = expression.replace(/[^0-9+\-*/.()%\s]/g, '');
    try {
      const result = Function(`"use strict"; return (${sanitized})`)();
      return { success: true, result, expression: sanitized };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },
  
  // Random number between min and max
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  
  // Format number with commas
  formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },
  
  // Percentage calculator
  percentage(value, total) {
    return ((value / total) * 100).toFixed(2);
  }
};

// ==========================================
// DATE/TIME TOOLS
// ==========================================
const dateTools = {
  // Current time in format
  currentTime() {
    const now = new Date();
    return now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  },
  
  // Format timestamp
  formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('en-IN');
  },
  
  // Time ago
  timeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    const intervals = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'week', seconds: 604800 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 }
    ];
    
    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
      }
    }
    
    return 'just now';
  },
  
  // Is it morning/afternoon/evening/night?
  getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  }
};

// ==========================================
// FILE TOOLS
// ==========================================
const fileTools = {
  // Read JSON file
  readJSON(filePath) {
    try {
      if (fs.existsSync(filePath)) {
        return fs.readJSONSync(filePath);
      }
      return null;
    } catch {
      return null;
    }
  },
  
  // Write JSON file
  writeJSON(filePath, data) {
    try {
      fs.ensureDirSync(path.dirname(filePath));
      fs.writeJSONSync(filePath, data, { spaces: 2 });
      return true;
    } catch {
      return false;
    }
  },
  
  // Get file size formatted
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },
  
  // Get file extension
  getExtension(filename) {
    return path.extname(filename).toLowerCase();
  }
};

// ==========================================
// NETWORK TOOLS
// ==========================================
const networkTools = {
  // Download file from URL
  async downloadFile(url, destPath) {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      fs.ensureDirSync(path.dirname(destPath));
      fs.writeFileSync(destPath, response.data);
      return { success: true, path: destPath, size: response.data.length };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },
  
  // Check if URL is valid
  isValidURL(str) {
    const pattern = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-./?%&=]*)?$/;
    return pattern.test(str);
  },
  
  // Extract URLs from text
  extractURLs(text) {
    const urlPattern = /https?:\/\/[^\s<>"]+|www\.[^\s<>"]+/g;
    return text.match(urlPattern) || [];
  },
  
  // Shorten URL using TinyURL
  async shortenURL(url) {
    try {
      const { data } = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
      return { success: true, shortUrl: data };
    } catch {
      return { success: false, error: 'Failed to shorten' };
    }
  }
};

// ==========================================
// DATA TOOLS
// ==========================================
const dataTools = {
  // Generate 8-digit pairing code (like WhatsApp)
  generatePairingCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code.match(/.{1,4}/g)?.join('-') || code;
  },
  
  // Generate unique ID
  generateID(prefix = 'STORM') {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  },
  
  // Parse phone number
  parsePhoneNumber(number) {
    const cleaned = number.replace(/[^0-9]/g, '');
    return {
      full: cleaned,
      countryCode: cleaned.slice(0, cleaned.length - 10),
      nationalNumber: cleaned.slice(-10),
      formatted: cleaned.length > 10 
        ? `+${cleaned.slice(0, cleaned.length - 10)}-${cleaned.slice(-10)}`
        : cleaned
    };
  },
  
  // Check if string is valid JSON
  isValidJSON(str) {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  }
};

// ==========================================
// COLOR TOOLS
// ==========================================
const colorTools = {
  // Hex to RGB
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },
  
  // RGB to Hex
  rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  },
  
  // Get random color
  randomColor() {
    const colors = [
      '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
      '#FF4500', '#DA70D7', '#FFD700', '#7FFF00', '#FF1493', '#00BFFF',
      '#FF6347', '#7B68EE', '#3CB371', '#FF69B4', '#F0E68C', '#DDA0DD',
      '#90EE90', '#FFA500', '#9370DB', '#87CEEB', '#98FB98', '#FFB6C1'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  },
  
  // Get color name from hex
  getColorName(hex) {
    const colorNames = {
      '#FF0000': 'Red', '#00FF00': 'Green', '#0000FF': 'Blue',
      '#FFFF00': 'Yellow', '#FF00FF': 'Pink', '#00FFFF': 'Cyan',
      '#FF4500': 'Orange Red', '#FFD700': 'Gold', '#FF1493': 'Deep Pink',
      '#00BFFF': 'Deep Sky Blue', '#7FFF00': 'Chartreuse', '#DA70D7': 'Orchid',
      '#FF6347': 'Tomato', '#7B68EE': 'Medium Slate Blue', '#3CB371': 'Medium Sea Green',
      '#FF69B4': 'Hot Pink', '#F0E68C': 'Khaki', '#DDA0DD': 'Plum',
      '#90EE90': 'Light Green', '#FFA500': 'Orange', '#9370DB': 'Medium Purple'
    };
    return colorNames[hex.toUpperCase()] || 'Unknown';
  }
};

// ==========================================
// EXPORT ALL
// ==========================================
module.exports = {
  textTools,
  mathTools,
  dateTools,
  fileTools,
  networkTools,
  dataTools,
  colorTools,
  
  // Direct exports for common tools
  reverse: textTools.reverse.bind(textTools),
  wordCount: textTools.wordCount.bind(textTools),
  mockText: textTools.mockText.bind(textTools),
  calculate: mathTools.calculate.bind(mathTools),
  currentTime: dateTools.currentTime.bind(dateTools),
  generateID: dataTools.generateID.bind(dataTools),
  generatePairingCode: dataTools.generatePairingCode.bind(dataTools),
  shortenURL: networkTools.shortenURL.bind(networkTools),
  isValidURL: networkTools.isValidURL.bind(networkTools),
  parsePhoneNumber: dataTools.parsePhoneNumber.bind(dataTools),
  randomColor: colorTools.randomColor.bind(colorTools)
};
