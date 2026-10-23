# ==========================================
# 1. Build Stage
# ==========================================
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Build application
COPY src ./src
RUN mvn clean package -DskipTests

# ==========================================
# 2. Runtime Stage
# ==========================================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Tạo user không có đặc quyền root để tăng tính bảo mật
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Thư mục lưu file upload
RUN mkdir -p /app/uploads && chown -R appuser:appgroup /app/uploads

USER appuser

COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

# Giới hạn RAM heap tối đa 384MB để phù hợp với EC2 1GB RAM
ENV JAVA_OPTS="-Xmx384m -Xms128m -XX:+UseG1GC"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
