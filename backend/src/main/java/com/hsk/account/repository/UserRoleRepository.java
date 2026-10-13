package com.hsk.account.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hsk.account.domain.UserEntity;
import com.hsk.account.domain.UserRoleEntity;

public interface UserRoleRepository extends JpaRepository<UserRoleEntity, Long> {

	List<UserRoleEntity> findByUser_Id(Long userId);

	boolean existsByUser_IdAndRole_Code(Long userId, com.hsk.account.domain.RoleCode code);
}
