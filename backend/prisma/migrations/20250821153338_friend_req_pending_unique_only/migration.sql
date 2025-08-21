-- 1) Eski unique index’i kaldır
DROP INDEX IF EXISTS "uniq_pending_pair_status";

-- 2) Sadece PENDING için (fromId,toId) tek olsun
--    Not: ters yönü (toId,fromId) DB tek başına zorlayamaz;
--    onu zaten servis katmanında OR ile engelliyoruz.
CREATE UNIQUE INDEX "uniq_pending_pair_pending_only"
ON "FriendRequest" ("fromId","toId")
WHERE status = 'PENDING';