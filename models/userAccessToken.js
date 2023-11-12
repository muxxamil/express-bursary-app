module.exports = function (sequelize, DataTypes) {

    const UserAccessToken = sequelize.define('UserAccessToken', {

        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER(11),
            field: 'user_id',
            allowNull: false,
        },
        value: {
            type: DataTypes.STRING(255),
            field: 'value',
            allowNull: false,
        },
        scope: {
            type: DataTypes.ENUM,
            values: ['forgotPassword', 'confirmEmail'],
            field: 'scope',
            allowNull: false,
        },
        expiredAt: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('DATE_ADD(NOW(), INTERVAL 2 HOUR)'),
            field: 'expired_at',
            allowNull: false,
        },
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        tableName: 'user_access_tokens'
    });

    UserAccessToken.associate = function (models) {
        UserAccessToken.belongsTo(models.User, {foreignKey: 'userId'});
    };

    UserAccessToken.DEFAULTS = {
        SCOPE: {
            FORGOT_PASSWORD: 'forgotPassword',
            CONFIRM_EMAIL: 'confirmEmail'
        }
    }

    UserAccessToken.sync()
    .then(() => console.log('UserAccessToken table created successfully'))
    .catch(err => console.log('BTW, did you enter wrong database credentials?'));

    return UserAccessToken;
}