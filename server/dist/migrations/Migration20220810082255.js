"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220810082255 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220810082255 extends migrations_1.Migration {
    async up() {
        this.addSql('create table "post" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" text not null);');
    }
}
exports.Migration20220810082255 = Migration20220810082255;
//# sourceMappingURL=Migration20220810082255.js.map