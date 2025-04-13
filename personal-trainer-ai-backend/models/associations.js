import { users } from "./users.models";
import { activity_logs } from "./activity_logs.models";
import { meals } from "./meals.models";

users.hasMany(meals,{foreignKey:'user_id'})
meals.belongsTo(users,{foreignKey:'user_id'})

users.hasMany(activity_logs, {foreignKey: 'user_id'})
activity_logs.belongsTo(users,{foreignKey : 'user_id'})