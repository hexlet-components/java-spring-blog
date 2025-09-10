package io.hexlet.blog.mapper;

import io.hexlet.blog.dto.PostCreateDTO;
import io.hexlet.blog.dto.PostDTO;
import io.hexlet.blog.dto.PostUpdateDTO;
import io.hexlet.blog.model.Post;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

@Mapper(uses = {JsonNullableMapper.class,
        ReferenceMapper.class}, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public abstract class PostMapper {
    @Mapping(source = "author.id", target = "authorId")
    public abstract PostDTO map(Post model);

    public abstract Post map(PostCreateDTO dto);

    @Mapping(source = "authorId", target = "author.id")
    public abstract Post map(PostDTO model);

    public abstract void update(PostUpdateDTO dto, @MappingTarget Post model);
}
