const bcrypt = require('bcrypt');

let nextId = 2;
const users = [];

class UserRecord {
  constructor(data) {
    this.id = data.id;
    this.username = data.username;
    this.password = data.password;
    this.inativo = data.inativo ?? 0;
    this.role = data.role ?? 3;
    this.createdAt = data.createdAt ?? new Date();
    this.updatedAt = data.updatedAt ?? new Date();
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      password: this.password,
      inativo: this.inativo,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  async save() {
    const index = users.findIndex((item) => item.id === this.id);
    if (index === -1) {
      return null;
    }

    this.updatedAt = new Date();
    users[index] = this.toJSON();
    return this;
  }

  async update(values) {
    Object.assign(this, values);
    this.updatedAt = values.updatedAt ?? new Date();
    return this.save();
  }

  async destroy() {
    const index = users.findIndex((item) => item.id === this.id);
    if (index === -1) {
      return null;
    }
    users.splice(index, 1);
    return this;
  }
}

const pickAttributes = (user, attributes) => {
  if (!attributes || attributes.length === 0) {
    return user;
  }

  const filtered = {};
  attributes.forEach((key) => {
    filtered[key] = user[key];
  });
  return filtered;
};

const asRecord = (user) => (user ? new UserRecord(user) : null);

const seedDefaultAdmin = () => {
  const adminUsername = process.env.DEFAULT_ADMIN_USERNAME;
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD;
  const passwordHash = bcrypt.hashSync(adminPassword, 10);
  const now = new Date();

  users.push({
    id: 1,
    username: adminUsername,
    password: passwordHash,
    inativo: 0,
    role: 1,
    createdAt: now,
    updatedAt: now,
  });
};

seedDefaultAdmin();

const seedDefaultUser = () => {
  const userUsername = process.env.DEFAULT_USER_USERNAME;
  const userPassword = process.env.DEFAULT_USER_PASSWORD;
  const passwordHash = bcrypt.hashSync(userPassword, 10);
  const now = new Date();

  users.push({
    id: nextId++,
    username: userUsername,
    password: passwordHash,
    inativo: 0,
    role: 3,
    createdAt: now,
    updatedAt: now,
  });
};

seedDefaultUser();

const User = {
  async findOne(options = {}) {
    const where = options.where || {};
    const attributes = options.attributes;

    const found = users.find((user) =>
      Object.entries(where).every(([key, value]) => user[key] === value)
    );

    if (!found) {
      return null;
    }

    if (attributes && attributes.length > 0) {
      return pickAttributes(found, attributes);
    }

    return asRecord(found);
  },

  async findAll(options = {}) {
    const attributes = options.attributes;

    return users.map((user) => {
      if (attributes && attributes.length > 0) {
        return pickAttributes(user, attributes);
      }
      return asRecord(user);
    });
  },

  async create(data) {
    const now = new Date();
    const newUser = {
      id: nextId++,
      username: data.username,
      password: data.password,
      inativo: data.inativo ?? 0,
      role: data.role ?? 3,
      createdAt: now,
      updatedAt: now,
    };

    users.push(newUser);
    return asRecord(newUser);
  },

  async findByPk(id) {
    const parsedId = Number(id);
    if (Number.isNaN(parsedId)) {
      return null;
    }

    const found = users.find((user) => user.id === parsedId);
    return asRecord(found);
  },
};

module.exports = { User };
