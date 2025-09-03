const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  dateOfBirth: {
    type: Date,
    required: function() {
      return !this.googleId; // Only required if not signing up with Google
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  // Google OAuth fields
  googleId: {
    type: String,
    unique: true,
    sparse: true // Allows multiple null values
  },
  profilePicture: {
    type: String,
    default: null
  },
  authProvider: {
    type: String,
    enum: ['email', 'google'],
    default: 'email'
  },
  verificationOTP: {
    type: String,
    default: null
  },
  otpExpires: {
    type: Date,
    default: null
  },
  signInOTP: {
    type: String,
    default: null
  },
  signInOTPExpires: {
    type: Date,
    default: null
  },
  lastSignIn: {
    type: Date,
    default: null
  },
  notes: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    tags: [{
      type: String,
      trim: true
    }],
    isImportant: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true
});

// Hash password before saving (if you decide to add password field later)
userSchema.pre('save', async function(next) {
  if (this.verificationOTP && this.isModified('verificationOTP')) {
    this.verificationOTP = await bcrypt.hash(this.verificationOTP, 12);
  }
  if (this.signInOTP && this.isModified('signInOTP')) {
    this.signInOTP = await bcrypt.hash(this.signInOTP, 12);
  }
  next();
});

// Method to compare OTP
userSchema.methods.compareOTP = async function(candidateOTP, hashedOTP) {
  return await bcrypt.compare(candidateOTP, hashedOTP);
};

// Method to generate and save OTP
userSchema.methods.createOTP = function(type = 'verification') {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  
  if (type === 'verification') {
    this.verificationOTP = otp;
    this.otpExpires = otpExpires;
  } else if (type === 'signin') {
    this.signInOTP = otp;
    this.signInOTPExpires = otpExpires;
  }
  
  return otp;
};

// Method to add a note
userSchema.methods.addNote = function(noteData) {
  this.notes.push({
    ...noteData,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  return this.save();
};

// Method to update a note
userSchema.methods.updateNote = function(noteId, updateData) {
  const note = this.notes.id(noteId);
  if (note) {
    Object.assign(note, updateData);
    note.updatedAt = new Date();
    return this.save();
  }
  return null;
};

// Method to delete a note
userSchema.methods.deleteNote = function(noteId) {
  this.notes.pull({ _id: noteId });
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
