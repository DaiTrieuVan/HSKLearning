package com.hsk.account.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hsk.account.domain.UserEntity;
import com.hsk.account.domain.UserRoleEntity;

public interface UserRoleRepository extends JpaRepository<UserRoleEntity, Long> {

	List<UserRoleEntity> findByUser_Id(Long userId);

	boolean existsByUser_IdAndRole_Code(Long userId, com.hsk.account.domain.RoleCode code);

	long countByRole_Code(com.hsk.account.domain.RoleCode code);

	@org.springframework.data.jpa.repository.Query("SELECT ur FROM UserRoleEntity ur JOIN FETCH ur.role WHERE ur.user.id IN :userIds")
	List<UserRoleEntity> findByUserIdInWithRoles(@org.springframework.data.repository.query.Param("userIds") List<Long> userIds);
}
