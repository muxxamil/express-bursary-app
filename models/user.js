module.exports = function (sequelize, DataTypes) {

    const User = sequelize.define('User', {

        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        firstName: {
            type: DataTypes.STRING(100),
            field: 'first_name',
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING(100),
            field: 'last_name',
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(100),
            unique : true,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        cell: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        roleId: {
            type: DataTypes.INTEGER(11),
            field: 'role_id',
            allowNull: false,
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        addedBy: {
            type: DataTypes.INTEGER(11),
            field: 'added_by'
        },
        updatedBy: {
            type: DataTypes.INTEGER(11),
            field: 'updated_by'
        },
    }, {
        paranoid: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        tableName: 'users'
    });

    User.associate = function (models) {

        User.belongsTo(models.UserRole, {foreignKey: 'roleId'});
        User.hasMany(models.UserAccessToken, {foreignKey: 'userId'});

    };

    User.sync()
    .then(() => console.log('User table created successfully'))
    .catch(err => console.log('BTW, did you enter wrong database credentials?'));

    return User;
}