const MONGO_OBJECT_ID_PATTERN = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i
module.exports = {
    MONGO_OBJECT_ID_PATTERN,
    ROLES: Object.freeze({
        USER: "USER",
        ADMIN: "ADMIN",
        CONTENT_MANAGER: "CONTENT_MANAGER",
        SUPPLIER: "SUPPLIER"
    }),
    PERMISSIONS: Object.freeze({
        USER: ["profile"],
        ADMIN: ["all"],
        SUPERADMIN: ["all"],
        CONTENT_MANAGER: ["blog", "category", "product"],
        COUNTER: ["MONEY"],
        SUPPLIER: ["product"],
        ALL: "all"
    }),
}